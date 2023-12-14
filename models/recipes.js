const mongoose = require('mongoose');

const prixSchema = mongoose.Schema({
    minimum: Number,
    personneSup: Number,
    panierCourseParPersonne: Number,
})

const ingredientsSchema = mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
})

const recipesSchema = mongoose.Schema({
    userChef: { type: mongoose.Schema.Types.ObjectId, ref: 'userChef' },
    title: String,
    image: String,
    time: String,
    Feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'feedback' }],
    type: String,
    notes: String,
    prix: prixSchema,
    ustensils: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ustensils' }], // Tableau de références vers les ustensiles
    ingredients: [{ingredientsSchema}],
});


const Recipes = mongoose.model('recipes', recipesSchema);

module.exports = Recipes;