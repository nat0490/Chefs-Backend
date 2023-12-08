const mongoose = require('mongoose');

const adresseSchema = mongoose.Schema({
    adresse: String,
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
    //orders: {type: mongoose.Schema.Types.ObjectId, ref: 'userConnexion'},

})

const UserDetails = mongoose.model('userDetails', userDetailsSchema);

module.exports = UserDetails;