const mongoose = require('mongoose');



const ustensilSchema = mongoose.Schema({
    nom: String,
    emoji: String,
})

const Ustensils = mongoose.model('ustensils', ustensilSchema);

module.exports = Order;