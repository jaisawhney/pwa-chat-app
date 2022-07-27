import express from 'express';
import http from 'http';
import {WebSocket, WebSocketServer} from 'ws'

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server});

wss.on("connection", ws => {
    ws.on("message", payload => {

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