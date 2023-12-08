const mongoose = require('mongoose');

const userConnexionSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
})

const UserConnexion = mongoose.model('userConnexion', userConnexionSchema);

module.exports = UserConnexion;