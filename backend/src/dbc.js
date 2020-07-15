/* eslint-disable prettier/prettier */

var mongoose = require('mongoose');


// var dburl = "mongodb://admin:admin1234@ds231207.mlab.com:31207/erpdata";
var dburl = "mongodb://localhost:27017/dataBase";
const connection = mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});

mongoose.connection.on('connected', function () {
    console.log("Server connected")
});

mongoose.connection.on('error', err => console.log('MongoDB connection error: ${err}'));


module.exports = connection;

