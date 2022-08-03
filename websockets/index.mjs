import {WebSocket, WebSocketServer} from 'ws'
import {nanoid} from "nanoid";

export default server => {
    const wss = new WebSocketServer({server});

    // TODO: Use a DB for room storage (SQL?)
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

        const leaveRoom = () => {
            const room = ws.room;
            rooms[room] = rooms[room].filter(socket => socket !== ws);

            if (rooms[room].length === 0) {
                delete rooms[room];
            }
            ws.room = undefined;
        }

        ws.on('message', data => {
            const payload = JSON.parse(data);
            const {type, params} = payload;

            switch (type) {
                case 'joinRoom':
                    joinRoom(params);
                    break;

                case 'leaveRoom':
                    leaveRoom();
                    break;

                case 'message':
                    broadcast(JSON.stringify(payload), ws.room);
                    break;
            }
        });

        ws.on('close', () => {
            leaveRoom();
        });
    });
}

