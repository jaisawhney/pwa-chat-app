import express from 'express';
import http from 'http';
import {indexRoutes, roomRoutes} from './routes/index.mjs'
import ws from './websockets/index.mjs'

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use('/', indexRoutes);
app.use('/rooms', roomRoutes);
app.use('/static', express.static('static'));

ws(server);

const port = parseInt(process.env.PORT) || 3000;
server.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});