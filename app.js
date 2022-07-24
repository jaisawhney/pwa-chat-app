const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/static/serviceWorker.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/serviceWorker.js'), {
        headers: {
            'Service-Worker-Allowed': '/'
        }
    });
});

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.render('index');
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});