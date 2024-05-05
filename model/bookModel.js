const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {type : String, required : true},
    author: {type : String, required : true},
    price : {type : Number, required : true},
    admin : {type : Object, required : true},
    createdAt : {type : Date, default : Date.now}
});

module.exports = mongoose.model('Book', bookSchema);