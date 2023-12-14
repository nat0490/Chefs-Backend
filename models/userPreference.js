const mongoose = require('mongoose');


  // userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
const userPreferenceSchema = mongoose.Schema({
<<<<<<< HEAD
  
=======
    //userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
>>>>>>> 351ed44d6f8864f08489c085c6a3e8034a826a60
    typeCuisine: String,
})

const UserPreference = mongoose.model('userPreference', userPreferenceSchema);

module.exports = UserPreference;