const http = require('http');

const data = JSON.stringify({
  text: "Hello World RC4 Encryption",
  key: "Secret123!"
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/encrypt',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Encrypt Response:', body);
    const resultObj = JSON.parse(body);
    if (!resultObj.success) return console.error('Error in encrypt payload.');
    
    // Test Decrypt
    const decData = JSON.stringify({
      text: resultObj.result,
      key: "Secret123!"
    });
    
    const decReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/decrypt',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(decData)
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
         console.log('Decrypt Response:', body2);
      });
    });
    decReq.write(decData);
    decReq.end();
  });
});

req.on('error', e => console.error(`Problem: ${e.message}`));
req.write(data);
req.end();
