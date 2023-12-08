const mongoose = require('mongoose');

const userChefSchema = mongoose.Schema({
    spécialisation: String,
    userCompliment: String,
    experience: String,
    passion: String,
    services: String,
    userDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'userDetails'},
    //recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'userConnexion'},
})

const UserChef = mongoose.model('userChef', userChefSchema);

module.exports = UserChef;