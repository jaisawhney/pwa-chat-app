const express = require('express');
const app = express();

app.set('views', 'static');

app.use('/static', express.static('static'))

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});