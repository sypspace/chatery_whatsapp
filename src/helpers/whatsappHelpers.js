// Helper utilities extracted from routes/whatsapp.js
// Reusable helpers: resolveDelay, isGroupChat, checkNumberRegistered, generateJobId
const resolveDelay = (delay) => {
    // If explicitly 0 or '0', return 0
    if (delay === 0 || delay === '0') return 0;

    // If not provided or set to 'auto', pick random 1-15 seconds
    if (delay === undefined || delay === null || delay === 'auto' || delay === '') {
        const secs = Math.floor(Math.random() * 15) + 1; // 1..15
        return secs * 1000;
    }

    const n = Number(delay);
    if (Number.isFinite(n) && n >= 0) return Math.round(n);

    // Fallback to random 1-15s
    const secs = Math.floor(Math.random() * 15) + 1;
    return secs * 1000;
};

const isGroupChat = (chatId) => {
    return typeof chatId === 'string' && chatId.includes('@g.');
};

const checkNumberRegistered = async (session, chatId) => {
    if (!chatId) return false;
    // If group id, assume OK
    if (isGroupChat(chatId)) return true;

    // Prefer raw phone if provided (numeric), otherwise strip non-digits
    const phone = String(chatId).replace(/[^0-9]/g, '');
    if (!phone) return false;

    try {
        const res = await session.isRegistered(phone);
        if (typeof res === 'boolean') return res;
        if (!res) return false;
        if (res.registered !== undefined) return !!res.registered;
        if (res.data && res.data.registered !== undefined) return !!res.data.registered;
        if (res.data && res.data.isRegistered !== undefined) return !!res.data.isRegistered;
        if (res.success) return true;
        return false;
    } catch (e) {
        return false;
    }
};

const generateJobId = () => {
    return `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

module.exports = {
    resolveDelay,
    isGroupChat,
    checkNumberRegistered,
    generateJobId
};
