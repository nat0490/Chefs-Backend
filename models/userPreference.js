const mongoose = require('mongoose');



const userPreferenceSchema = mongoose.Schema({
<<<<<<< HEAD
    // userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
=======
    //userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
>>>>>>> e4d0e71ad43c3957659bf3a62e1aa1340507fd4e
    typeCuisine: String,
})

const UserPreference = mongoose.model('userPreference', userPreferenceSchema);

module.exports = UserPreference;