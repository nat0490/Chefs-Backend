var express = require('express');
var router = express.Router();

const Order = require('../models/orders');
const { checkBody } = require('../modules/checkBody');


//AUCUN TEST EFFECTUE SUR CES ROUTES
//EN ATTENTE DE RECETTES

//ENREGISTRER UNE COMMANDE => Test TC OK
router.post('/add', (req,res)=> {
    if (!checkBody(req.body, ['recipes', 'userConnexion', 'montant', 'date'])) {
        res.status(500).json({ result: false, error: 'Missing or empty fields' });
        return;
    } else {
        const newOrder = new Order({
            recipes: req.body.recipes,
            userConnexion: req.body.userConnexion,
            montant: req.body.montant,
            //2023-12-01T12:30:00.000Z
            date: req.body.date,
          });
          newOrder.save().then(newOrd => {
            res.json({ result: true, newOrd });
          });
        }
      }
    );


//VOIR TOUTES LES COMMANDES D'UN CLIENT => Test NOK quand user existe pas
router.get('/all/user/:UserConnexionId', (req,res) => {
    Order.find({ userConnexion: req.params.UserConnexionId})
        .then(data => {
            if (data) {
                res.json({ result: true, orders: data})
            } else {
                res.json({ result: false, message: "no order for this user"})
            }
        })
})

//VOIR TOUTES LES COMMANDES POUR UN CHEF => Ca m'a l'air ok sur TC!
router.get('/all/chef/:ChefId', (req, res) => {
    //{ 'recipes.userChef': req.params.ChefId }
    Order.find()
        .populate("recipes")
        .then(data => {
            //console.log(data);
            if (data) {
                const ordersForChef = data.filter(order => order.recipes.userChef.toString() === req.params.ChefId);
                //console.log(ordersForChef);
                if (ordersForChef.length > 0) {
                    res.json({ result: true, orders: ordersForChef });
                } else {
                    res.json({ result: false, message: "No orders for this chef" });
                } 
            } else {
                res.json({ result: false, message: "No data found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ result: false, error: 'Internal Server Error' });
        });
});

//VOIR TOUTES LES COMMANDES
router.get('/all', (req,res) => {
    Order.find()
        .then(data => {
            if (data) {
                res.json({ result: true, orders: data})
            } else {
                res.json({ result: false, message: "no order"})
            }
        })
})


module.exports = router;