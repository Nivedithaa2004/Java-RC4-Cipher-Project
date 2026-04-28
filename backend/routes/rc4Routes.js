const express = require('express');
const router = express.Router();
const rc4Controller = require('../controllers/rc4Controller');

router.post('/encrypt', rc4Controller.encrypt);
router.post('/decrypt', rc4Controller.decrypt);

module.exports = router;
