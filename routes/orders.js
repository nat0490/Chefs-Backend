var express = require('express');
var router = express.Router();

const Order = require('../models/orders');
const { checkBody } = require('../modules/checkBody');


//AUCUN TEST EFFECTUE SUR CES ROUTES
//EN ATTENTE DE RECETTES

//ENREGISTRER UNE COMMANDE => Test à faire une fois recipes créé
router.post('/add', (req,res)=> {
    if (!checkBody(req.body, ['recipes', 'userConnexion', 'montant', 'date'])) {
        res.status(500).json({ result: false, error: 'Missing or empty fields' });
        return;
    } else {
        const newOrder = new Order({
            recipe: req.body.recipe,
            userConnexion: req.body.userConnexion,
            montant: req.body.montant,
            date: req.body.date,
          });
          newOrder.save().then(newOrd => {
            res.json({ result: true, newOrd });
          });
        }
      }
    );


//VOIR TOUTES LES COMMANDES D'UN CLIENT
router.get('/all/:UserConnexionId', (req,res) => {
    Order.find({ userConnexion: req.params.UserConnexionId})
        .then(data => {
            if (data) {
                res.json({ result: true, orders: data})
            } else {
                res.json({ result: false, message: "no order for this user"})
            }
        })
})

//VOIR TOUTES LES COMMANDES POUR UN CHEF
router.get('/all/:UserChefId', (req,res) => {
    Order.find()
        .then(data => {
            if (data) {
                const orderForChef = data.filter(e => {
                    e.recipes.userChef !== req.params.UserChefId
                });
                if (orderForChef) {
                    res.json({ result: true, orders: orderForChef})
                } else {
                    res.json({ result: false, message: "no order for this chef"})
                }
            }
        });
});

//VOIR TOUTES LES COMMANDES
router.get('/all/:UserConnexionId', (req,res) => {
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