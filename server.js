import path from 'path';
import express from 'express';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.resolve('./docs'))); // exprss.static() to server static file
app.use('/', express.static(path.resolve('./docs'))); // exprss.static() to server static file

const __dirname = path.resolve();

app.use((req, res, next) => {
    console.log('req.url:', req.url);
    next();
});

app.get('/', (req, res) => {
    res.status(200).set({ 'Content-Type': 'text/html' }).sendFile(__dirname + '/docs/index.html');
});

app.listen(PORT, () => {
    console.log(`server is running (port:${PORT})`);
});