const mongoose = require('mongoose');

const adresseSchema = mongoose.Schema({
    rue: {
        type: String,
        match: /^[a-zA-Z0-9\s]*$/, // Autoriser les lettres, les chiffres et les espaces
    },
    ville: String,
    codePostal: String,
});

const userProfilSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    dateOfBirth: String,
    adresse: adresseSchema,
    tel: String,
    chef: Boolean,
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}],
    userPreference: [{type: mongoose.Schema.Types.ObjectId, ref: 'userPreference'}]
})

const UserProfil = mongoose.model('userProfil', userProfilSchema);

module.exports = UserProfil;
   
