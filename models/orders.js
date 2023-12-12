const mongoose = require('mongoose');



const ordersSchema = mongoose.Schema({
    recipes: {type: mongoose.Schema.Types.ObjectId, ref: 'recipes'},
    userConnexion: {type: mongoose.Schema.Types.ObjectId, ref: 'userConnexion'},
    status: String,
    montant: Number,
    //format: 2023-12-01T12:30:00.000Z
    date: Date,
})

const Order = mongoose.model('orders', ordersSchema);

module.exports = Order;