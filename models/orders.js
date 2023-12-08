const mongoose = require('mongoose');



const ordersSchema = mongoose.Schema({
    recipes: {type: mongoose.Schema.Types.ObjectId, ref: 'recipes'},
    userConnexion: {type: mongoose.Schema.Types.ObjectId, ref: 'userConnexion'},
    //USERCHEF? DEJA DANS LA RECETTE, ON RAJOUTE QUAND MÊME?
    userCHEF: {type: mongoose.Schema.Types.ObjectId, ref: 'userChef'},
    montant: Number,
    date: Date,
})

const Order = mongoose.model('orders', ordersSchema);

module.exports = Order;