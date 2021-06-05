const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes');
const mongodb = require('./database/mongo');
var port = 4000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init mongodb connection
mongodb.createConnection().then(db=>{
    console.log("mono connected");
}).catch((error)=>{
    console.log("mongo connection failed");
})

app.use(router);

app.listen(port, function () {
    console.log('Node server is running..' + port);
});  