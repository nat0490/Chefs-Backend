const mongoose = require('mongoose');

const prixSchema = mongoose.Schema({
    minimum: Number,
    personneSup: Number,
    panierCourseParPersonne: Number,
})

//SOUS-DOC OU CLE ETRANGERE???
const ustensilSchema = mongoose.Schema({
    name: String,
    quantity: Number,
})

const ingredientsSchema = mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
})

const recipesSchema = mongoose.Schema({
    userChef: {type: mongoose.Schema.Types.ObjectId, ref: 'userChef'},
    name: String,
    image: String,
    time: String,
    //Feedback: [{type: mongoose.Schema.Types.ObjectId, ref: 'userChef'}],
    type: String,
    notes: String,
    prix: prixSchema,
    ustensils: [ustensilSchema],
    ingredients: [ingredientsSchema],
})

const Recipes = mongoose.model('recipes', recipesSchema);

module.exports = Recipes;