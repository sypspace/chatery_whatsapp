const { Queue, Worker, QueueScheduler, UnrecoverableError } = require('bullmq');
const whatsappManager = require('../whatsapp');
const { checkNumberRegistered } = require('../../helpers/whatsappHelpers');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const connection = { host: REDIS_HOST, port: REDIS_PORT };

const QUEUE_NAME = process.env.MESSAGE_QUEUE_NAME || 'message-queue';
const QUEUE_CONCURRENCY = Number(process.env.QUEUE_CONCURRENCY) || 5;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 20;
const RATE_LIMIT_DURATION = Number(process.env.RATE_LIMIT_DURATION) || 1000; // ms

// Initialize Queue with optional rate limiter
const queue = new Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 500
        }
    },
    // limiter: control throughput (max jobs per duration)
    limiter: {
        max: RATE_LIMIT_MAX,
        duration: RATE_LIMIT_DURATION
    }
});

// Required to enable delayed jobs and retries
const scheduler = new QueueScheduler(QUEUE_NAME, { connection });

// Worker processes jobs
const worker = new Worker(
    QUEUE_NAME,
    async job => {
        const { name, data } = job;

        // Common: get session by id
        const session = whatsappManager.getSession(data.sessionId);
        if (!session) throw new Error('Session not found: ' + data.sessionId);

        switch (name) {
                case 'send-text': {
                    if (!data.skipNumberCheck) {
                        const ok = await checkNumberRegistered(session, data.chatId);
                        if (!ok) throw new UnrecoverableError('Phone number is not registered on WhatsApp');
                    }
                    return await session.sendTextMessage(data.chatId, data.message, data.typingTime || 0);
                }
                case 'send-image': {
                    if (!data.skipNumberCheck) {
                        const ok = await checkNumberRegistered(session, data.chatId);
                        if (!ok) throw new UnrecoverableError('Phone number is not registered on WhatsApp');
                    }
                    return await session.sendImage(data.chatId, data.imageUrl, data.caption || '', data.typingTime || 0);
                }
                case 'send-document': {
                    if (!data.skipNumberCheck) {
                        const ok = await checkNumberRegistered(session, data.chatId);
                        if (!ok) throw new UnrecoverableError('Phone number is not registered on WhatsApp');
                    }
                    return await session.sendDocument(data.chatId, data.documentUrl, data.filename, data.mimetype, data.typingTime || 0);
                }
                case 'send-location': {
                    if (!data.skipNumberCheck) {
                        const ok = await checkNumberRegistered(session, data.chatId);
                        if (!ok) throw new UnrecoverableError('Phone number is not registered on WhatsApp');
                    }
                    return await session.sendLocation(data.chatId, data.latitude, data.longitude, data.name || '', data.typingTime || 0);
                }
                case 'send-contact': {
                    const target = data.contactPhone || data.chatId;
                    if (!data.skipNumberCheck) {
                        const ok = await checkNumberRegistered(session, target);
                        if (!ok) throw new UnrecoverableError('Phone number is not registered on WhatsApp');
                    }
                    return await session.sendContact(data.chatId, data.contactName, data.contactPhone, data.typingTime || 0);
                }
                case 'send-button': {
                    if (!data.skipNumberCheck) {
                        const ok = await checkNumberRegistered(session, data.chatId);
                        if (!ok) throw new UnrecoverableError('Phone number is not registered on WhatsApp');
                    }
                    return await session.sendButton(data.chatId, data.text, data.footer || '', data.buttons || [], data.typingTime || 0);
                }
            default:
                throw new Error('Unknown job name: ' + name);
        }
    },
    { connection, concurrency: QUEUE_CONCURRENCY }
);

worker.on('failed', (job, err) => {
    // simple logging; consider emitting webhook/event here
    console.error(`Job ${job.id} (${job.name}) failed:`, err.message || err);
});

worker.on('completed', (job, result) => {
    // console.log(`Job ${job.id} completed`);
});

module.exports = { queue, worker, scheduler };
