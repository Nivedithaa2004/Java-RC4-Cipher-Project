function ksa(key) {
    let s = Array.from({ length: 256 }, (_, i) => i);
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        [s[i], s[j]] = [s[j], s[i]];
    }
    return s;
}

function prga(s, input) {
    let i = 0;
    let j = 0;
    let res = [];
    for (let k = 0; k < input.length; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        [s[i], s[j]] = [s[j], s[i]];
        let keyByte = s[(s[i] + s[j]) % 256];
        
        let targetByte = typeof input === 'string' ? input.charCodeAt(k) : input[k];
        res.push(targetByte ^ keyByte);
    }
    return Buffer.from(res);
}

function encrypt(text, key) {
    const s = ksa(key);
    const bufferRes = prga(s, text);
    return bufferRes.toString('base64');
}

function decrypt(base64Text, key) {
    const s = ksa(key);
    const inputBuffer = Buffer.from(base64Text, 'base64');
    const bufferRes = prga(s, inputBuffer);
    return bufferRes.toString('utf-8');
}

module.exports = {
    encrypt,
    decrypt,
    ksa,
    prga
};
