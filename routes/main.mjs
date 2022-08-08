import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        rooms: []
    });
});

router.get('/static/serviceWorker.js', (req, res) => {
    res.sendFile('/static/serviceWorker.js', {
        root: '.',
        headers: {
            'Service-Worker-Allowed': '/'
        }
    });
});

export {router as indexRoutes};