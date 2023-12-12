var express = require('express');
var router = express.Router();

const Order = require('../models/orders');
const { checkBody } = require('../modules/checkBody');



//ENREGISTRER UNE COMMANDE => Test TC OK

router.post('/add', (req,res)=> {
    if (!checkBody(req.body, [ 'recipes', 'userConnexion','status', 'montant', 'date'])) {
        res.status(500).json({ result: false, error: 'Missing or empty fields' });
        return;
    } else {
        const newOrder = new Order({
            recipes: req.body.recipes,
            userConnexion: req.body.userConnexion,
            status :req.body.status,
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


//VOIR TOUTES LES COMMANDES D'UN CLIENT => Test TC OK
//TOMBE EN ERROR 500 SI SE N'EST PAS UN ID
router.get('/all/user/:UserConnexionId', (req, res) => {
    Order.find({ userConnexion: req.params.UserConnexionId })
        .then(data => {
            console.log(data);
            if (data && data.length > 0) {
                res.json({ result: true, orders: data })
            } else {
                res.json({ result: false, message: "no order for this user" })
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ result: false, error: 'Internal Server Error' });
        });
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

//VOIR TOUTES LES COMMANDES => test TC OK
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


// METTRE A JOUR le status d'une oders
router.put('/updatestatus/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;
  
    Order.findOne({ _id: orderId })
  
        .then((data)=> {
            if (data.status === newStatus) { //status identique à l'ancien
              res.json({ result: false, message: 'Same status'})
            } else {
                Order.updateOne(
                { _id: orderId },
                { $set: { status: newStatus }}
                ).then((data => {
                  if (data.acknowledged === false) {
                    res.status(500).json({ result: false, error: "noMatch" });
                  } else {
                    res.json({ result: true, message: 'status change' });
                  }
                }));
            }
        })
      });
  


module.exports = router;