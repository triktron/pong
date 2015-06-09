var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var WebSocketServer = require('ws').Server;

var Games = [];
var ws = new WebSocketServer({
    server: http,
    autoAcceptConnections: false
});

ws.on('connection', function connection(client) {
    client.on('message', function incoming(message) {
        console.log(message);
        switch (message[0]) {
            case 0:
                console.log("conected");
            break;
            case 1:
                message = message.slice(1,message.length);
                console.log(message);
                console.log(String.fromCharCode.apply(null, new Uint16Array(message)));
            break;
        }
    });
});

app.get('/*', function (req, res) {
    res.contentType('text/html');
    fs.readFile(__dirname + '/client/ws.html', function (err, data) {
        if (err) throw err;
        res.send(data.toString());
    });
});

http.listen(8080, 'localhost', function () {
    console.log('listening on *:8080');
});
