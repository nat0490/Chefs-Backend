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
    chef: Boolean,
    userConnexion: {type: mongoose.Schema.Types.ObjectId, ref: 'userConnexion'},
    orders: {type: mongoose.Schema.Types.ObjectId, ref: 'orders'},
    userPreference: {type: mongoose.Schema.Types.ObjectId, ref: 'userPreference'}

})

const UserDetails = mongoose.model('userDetails', userDetailsSchema);

module.exports = UserDetails;