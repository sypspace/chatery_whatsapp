const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { queue } = require('./index');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queue-monitor');

createBullBoard({
    serverAdapter,
    queues: [new BullMQAdapter(queue)]
});

module.exports = serverAdapter.getRouter();
