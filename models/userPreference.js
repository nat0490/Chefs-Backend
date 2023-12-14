const mongoose = require('mongoose');


  // userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
const userPreferenceSchema = mongoose.Schema({
  
    typeCuisine: String,
})

const UserPreference = mongoose.model('userPreference', userPreferenceSchema);

module.exports = UserPreference;