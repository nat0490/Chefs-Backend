const mongoose = require('mongoose');

const ustensilSchema = mongoose.Schema({
    nom: String,
});

const Ustensils = mongoose.model('ustensils', ustensilSchema); // Utilisation du bon nom pour le modèle

module.exports = Ustensils; 