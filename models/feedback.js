const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    userDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'userDetails'},
    userChef: {type: mongoose.Schema.Types.ObjectId, ref: 'userChef'},
    rating: Number,
    commentaire: String,
})

const Feedback = mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;