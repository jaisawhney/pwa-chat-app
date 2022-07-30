import express from 'express';
import http from 'http';
import {WebSocket, WebSocketServer} from 'ws'
import {nanoid} from 'nanoid'

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server});


let rooms = {};
wss.on('connection', ws => {
    const broadcast = (payload, roomId) => {
        for (const client of rooms[roomId] || wss.clients) {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(payload);
            }
        }
    }

    const joinRoom = params => {
        const room = params.roomId || nanoid(10);
        if (!rooms[room]) {
            rooms[room] = [ws];
        } else {
            rooms[room].push(ws);
        }

        ws.room = room;
    }

    const leaveRoom = (params) => {
        const roomId = params.roomId;
        delete rooms[roomId][ws];

        if (rooms[roomId].length === 0) {
            delete rooms[roomId];
        }
    }

    ws.on('message', data => {
        const payload = JSON.parse(data);
        const {type, params} = payload;

        switch (type) {
            case 'joinRoom':
                joinRoom(params);
                break;

            case 'leaveRoom':
                leaveRoom(params);
                break;

            case 'message':
                broadcast(JSON.stringify(payload), ws.room);
                break;
        }
    });

    ws.on('close', () => {
        leaveRoom({roomId: ws.room});
    });
});

app.set('view engine', 'ejs');

app.get('/static/serviceWorker.js', (req, res) => {
    res.sendFile('/static/serviceWorker.js', {
        root: '.',
        headers: {
            'Service-Worker-Allowed': '/'
        }
    });
});

app.use(express.urlencoded({extended: false}));
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/rooms/:roomId', (req, res) => {
    res.render('chat', {roomId: req.params.roomId});
});

const port = parseInt(process.env.PORT) || 3000;
server.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});