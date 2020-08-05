var https = require('https');
var encoding = require('utf8');
var fs = require('fs');

var options = {
  key: [ fs.readFileSync('key.pem')],
  cert: [ fs.readFileSync('cert.pem')],
  passphrase : 'titanic'
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);