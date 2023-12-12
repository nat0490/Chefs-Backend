const mongoose = require('mongoose');

const adresseSchema = mongoose.Schema({
    rue: String,
    ville: String,
    codePostal: String,
})

const userProfilSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    adresse: adresseSchema,
    tel: String,
    chef: Boolean,
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}],
    userPreference: [{type: mongoose.Schema.Types.ObjectId, ref: 'userPreference'}]
})

const UserProfil = mongoose.model('userProfil', userProfilSchema);

module.exports = UserProfil;
   
