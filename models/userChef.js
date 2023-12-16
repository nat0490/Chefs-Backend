const mongoose = require('mongoose');

const userChefSchema = mongoose.Schema({
    spécialisation: String,
    userCompliment: String,
    experience: String,
    passion: String,
    services: String,
    userProfil: {type: mongoose.Schema.Types.ObjectId, ref: 'userProfil'},
    recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'recipes'}],
})

const UserChef = mongoose.model('userChef', userChefSchema);

module.exports = UserChef;