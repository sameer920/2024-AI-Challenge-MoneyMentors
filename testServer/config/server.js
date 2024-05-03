const express = require('express');
const http = require("http");
require("dotenv").config()


const app = express();
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);
})

module.exports = {app, server};