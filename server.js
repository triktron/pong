var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var uuid = require('node-uuid');
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        server: http
    });
var wsClients = [];
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        server: http
    });
var Games = [];

function GetGameById(name) {
    var GameExists = false;
    for (var i = 0; i < Games.length; i++) {
        if (Game[i].name == data.name) GameExists = i;
    }
    if (GameExists) return Games[i]; else return null;
}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        var data = JSON.parse(message);
        if (data.CONNECTING) {

            var game = GetGameById(data.name);
            if (game == null) {
                Games.push({
                    "name": data.name,
                    "clients": []
                });
                game = GetGameById(data.name);
                console.log("creating game on id", game.name);
            }
            ws.name = uuid.v1();
            game.clients.push({
                "id": ws.name,
                "ws": ws
            });
            ws.send("setId:" + ws.name);

            console.log(game.clients,"joint",game.name);
        }
        if (data.GetPlayer2Pos) {

        }
    });
});

app.use(function (request, response, next) {
    console.log("In comes a " + request.method + " to " + request.url);
    next();
});

app.get('/', function (req, res) {
    res.contentType('text/html');
    fs.readFile(__dirname + '/client/index.html', function (err, data) {
        if (err) throw err;
        res.send(data.toString());
    });
});
app.get('/ws', function (req, res) {
    res.contentType('text/html');
    fs.readFile(__dirname + '/client/ws.html', function (err, data) {
        if (err) throw err;
        res.send(data.toString());
    });
});
app.get('/main.js', function (req, res) {
    res.contentType('text/javascript');
    fs.readFile(__dirname + '/client/main.js', function (err, data) {
        if (err) throw err;
        res.send(data.toString());
    });
});
app.get('/main.css', function (req, res) {
    res.contentType('text/css');
    fs.readFile(__dirname + '/client/main.css', function (err, data) {
        if (err) throw err;
        res.send(data.toString());
    });
});
app.get('/triktronIsTheBest', function (req, res) {
    res.send("I know<br>you are too;)");
});

http.listen(80, '0.0.0.0', function () {
    console.log('listening on *:80');
});
