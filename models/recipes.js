const mongoose = require('mongoose');

const prixSchema = mongoose.Schema({
    minimum: Number,
    personneSup: Number,
    panierCourseParPersonne: Number,
});

const ingredientsSchema = mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
});

const recipesSchema = mongoose.Schema({
    userchef: { type: mongoose.Schema.Types.ObjectId, ref: 'userchefs' },
    title: String,
    image: String,
    time: String,
    feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'feedbacks' }],
    type: String,
    notes: [Number],
    prix: prixSchema,
    ustensils: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ustensils' }], // Tableau de références vers les ustensiles
    ingredients: [ingredientsSchema],
});


const Recipes = mongoose.model('recipes', recipesSchema);

module.exports = Recipes;