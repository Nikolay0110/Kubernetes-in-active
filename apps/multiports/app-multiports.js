const http = require('http');
const os = require('os');

console.log('Kubia сервер запущен...');

let handler = function(request, response) {
    console.log('Received request from ' + request.connection.remoteAddress);
    response.writeHead(200);
    response.end("Вы попали на хост - " + os.hostname() + "\n");
};

let www = http.createServer(handler);
www.listen(8080);
let www_2 = http.createServer(handler);
www_2.listen(8443);
