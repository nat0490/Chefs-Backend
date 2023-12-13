const mongoose = require('mongoose');



const userPreferenceSchema = mongoose.Schema({
    // userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
    typeCuisine: String,
})

const UserPreference = mongoose.model('userPreference', userPreferenceSchema);

module.exports = UserPreference;