const rc4 = require('../utils/rc4');

exports.encrypt = (req, res) => {
    try {
        const { text, key } = req.body;
        if (!text || !key) {
            return res.status(400).json({ success: false, error: 'Text and key are required' });
        }
        const result = rc4.encrypt(text, key);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.decrypt = (req, res) => {
    try {
        const { text, key } = req.body;
        if (!text || !key) {
            return res.status(400).json({ success: false, error: 'Text and key are required' });
        }
        
        const result = rc4.decrypt(text, key);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
