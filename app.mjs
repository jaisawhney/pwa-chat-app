import express from 'express';
import http from 'http';
import {WebSocket, WebSocketServer} from 'ws'
import crypto from 'crypto';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server});

const rooms = {};
wss.on('connection', ws => {
    const broadcast = (payload, roomId) => {
        for (const client of rooms[roomId] || wss.clients) {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(payload);
            }
        }
    }

    const createRoom = () => {
        const roomId = crypto.randomUUID();

        rooms[roomId] = [ws];
        ws.room = roomId;
        return roomId
    }

    const joinRoom = (params) => {
        const roomId = params.roomId

        if (!rooms[roomId]) return;
        if (!rooms[roomId][ws]) return;

        rooms[roomId].push(ws);
        ws.room = roomId;
    }

    const leaveRoom = (params) => {
        const roomId = params.roomId

        if (rooms[roomId].length === 1) {
            delete rooms[roomId]
        } else {
            delete rooms[roomId][ws]
        }
    }

    ws.on('message', data => {
        const payload = JSON.parse(data);

        switch (payload.type) {
            case 'joinRoom':
                joinRoom(payload.params);
                break;

            case 'leaveRoom':
                leaveRoom(payload.params);
                break;

            case 'message':
                broadcast(JSON.stringify(payload));
                break;
        }
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

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat/:chatId', (req, res) => {
    //console.log(req.params?.chatId)
    res.render('chat');
});

const port = parseInt(process.env.PORT) || 3000;
server.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});