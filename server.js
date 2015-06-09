var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var uuid = require('node-uuid');
var WebSocketServer = require('ws').Server;

var Games = [];
var ws = new WebSocketServer({
    server: http
});

function GetGameById(name) {
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].name == name) return Games[i];
    }
    return null;
}

function RemoveGameById(name) {
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].name == name) Games.splice(i,1);
    }
    return true;
}

ws.on('connection', function (client) {
    client.id = uuid.v1();
    client.send('SetId;' + client.id);

    client.on('close', function () {
        if (client.game != null) {
            if (client.game.p1.id == client.id) {
                client.game.p1.id = client.game.p2.id;
            }
            client.game.p2 = {id:false,y:16,score:0};
            if (client.game.p1.id == false && client.game.p2.id == false) RemoveGameById(client.game.name);
        }

        console.log('a client with id', client.id, "disconected!");
    });
    client.on('message', function (message) {
        console.log('received: %s', message);
        var comand = message.split(";")[0];
        var args = message.split(";").splice(1, message.split(";").length - 1);

        switch (comand) {
        case "join":
            client.game = GetGameById(args[0]);
            if (client.game == null) {
                Games.push({name:args[0],p1:{id:client.id,y:16,score:0},p2:{id:false,y:16,score:0}});
                client.game = Games[Games.length - 1];
                client.send("done;p1");
            } else if (client.game.p2.id == false) {
                client.game.p2.id = client.id;
                client.send("done;p2");
            } else if (client.game.p1.id != false && client.game.p2.id != false) client.send("full;");
        break;
        }
    });
    console.log("new client conected with id", client.id, "!");
});


/*
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
*/
app.use(function (request, response, next) {
    console.log("In comes a " + request.method + " to " + request.url);
    next();
});
app.get('/(room/*)?', function (req, res) {
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

http.listen(8080, 'localhost', function () {
    console.log('listening on *:8080');
});
