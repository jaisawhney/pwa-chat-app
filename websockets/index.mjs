import {WebSocket, WebSocketServer} from 'ws'

export let rooms = {};

export default server => {
    const wss = new WebSocketServer({server});

    wss.on('connection', ws => {
        ws.send(JSON.stringify(['updateRoomList', {
            rooms: Object.keys(rooms)
        }]));

        const broadcast = (payload, roomId, inclClient = false) => {
            for (const client of rooms[roomId] || wss.clients) {
                if ((client.readyState === WebSocket.OPEN) && (inclClient || client !== ws)) {
                    client.send(payload);
                }
            }
        }

        const joinRoom = (payload) => {
            const room = payload?.room?.toLowerCase();
            if (room) {
                leaveRoom();

                if (!rooms[room]) {
                    rooms[room] = [ws];
                    broadcast(JSON.stringify(['updateRoomList', {
                        rooms: Object.keys(rooms)
                    }]), null, true);
                } else {
                    rooms[room].push(ws);
                }
                ws.room = room;
            }
        }

        const leaveRoom = () => {
            const room = ws.room;
            if (room) {
                rooms[room] = rooms[room].filter(socket => socket !== ws);
                if (rooms[room].length === 0) {
                    delete rooms[room];
                    broadcast(JSON.stringify(['updateRoomList', {
                        rooms: Object.keys(rooms)
                    }]), null, true);
                }
                ws.room = undefined;
            }
        }

        const chatMsg = (payload) => {
            broadcast(JSON.stringify(['chatMsg', payload]), ws.room);
        }

        ws.on('message', msg => {
            const data = JSON.parse(msg);
            const [eventName, payload] = data;

            switch (eventName) {
                case 'joinRoom':
                    joinRoom(payload);
                    break;

                case 'chatMsg':
                    chatMsg(payload);
                    break;
            }
        });

        ws.on('close', () => {
            leaveRoom();
        });
    });
}

