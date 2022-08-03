import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    //console.log(!!req.body.private)
    res.redirect(`/rooms/${req.body.roomTopic}`)
});

router.get('/:roomId', (req, res) => {
    res.render('chat', {roomId: req.params.roomId});
});

export {router as roomRoutes};