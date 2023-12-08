const mongoose = require('mongoose');

const adresseSchema = mongoose.Schema({
    rue: String,
    ville: String,
    codePostal: String,
})

const userDetailsSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    adresse: adresseSchema,
    tel: String,
    cuisto: Boolean,
    userConnexion: {type: mongoose.Schema.Types.ObjectId, ref: 'userConnexion'},
    orders: {type: mongoose.Schema.Types.ObjectId, ref: 'orders'},

})

const UserDetails = mongoose.model('userDetails', userDetailsSchema);

module.exports = UserDetails;