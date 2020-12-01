const express = require('express');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());

server.listen(5000, () => {
    console.log('listening on port 5000')
})