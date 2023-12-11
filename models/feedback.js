const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
    recipes: {type: mongoose.Schema.Types.ObjectId, ref: 'recipes'},
    rating: Number,
    commentaire: String,
    date: Date,
})

const Feedback = mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;