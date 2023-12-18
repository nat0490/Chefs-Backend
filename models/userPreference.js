const mongoose = require('mongoose');


  // userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
const userPreferenceSchema = mongoose.Schema({
<<<<<<< HEAD
=======
  
>>>>>>> 9881b980180a924b012eb53a1c3100236e6f57d9
    typeCuisine: String,
})

const UserPreference = mongoose.model('userPreference', userPreferenceSchema);

module.exports = UserPreference; 