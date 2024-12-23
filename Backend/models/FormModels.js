const mongoose = require('mongoose');
const schema = mongoose.Schema

const formSchema = new schema({
    name:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true})

module.exports = mongoose.model('Users', formSchema);

