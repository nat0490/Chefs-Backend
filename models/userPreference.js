const mongoose = require('mongoose');


  // userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
const userPreferenceSchema = mongoose.Schema({
<<<<<<< HEAD
  
=======
>>>>>>> 9a28050a0c8efad138ff8986a74613d08dd99da8
    typeCuisine: String,
})

const UserPreference = mongoose.model('userPreference', userPreferenceSchema);

module.exports = UserPreference; 