const mongoose = require('mongoose');

const userConnexionSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    userProfile: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
})

const UserConnexion = mongoose.model('userConnexion', userConnexionSchema);

module.exports = UserConnexion;