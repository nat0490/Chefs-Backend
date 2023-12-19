var express = require('express');
var router = express.Router();

const UserProfil = require('../models/userProfil');
const { checkBody } = require('../modules/checkBody');
const UserConnexion = require('../models/userConnexion');


//créer un userProfil => Test TC OK
router.post('/create/:userConnexionId', (req, res) => {
    //Toutes les infos sont demandé d'un coup
    if (!checkBody(req.body, ['nom', 'prenom', 'dateOfBirth', 'tel', 'rue', 'ville', 'codePostal', 'chef'])) {
      res.status(500).json({ result: false, error: 'Missing or empty fields' });
      return;
    }
    //le profil est-il déjà créé pour cet ID de connexion?
    UserProfil.findOne({ userConnexion: req.params.userConnexionId }).then(data => {
      if (data === null) {
        const newProfil = new UserProfil({
          userConnexion: req.params.userConnexionId,
          nom: req.body.nom,
          prenom: req.body.prenom,
          dateOfBirth: req.body.dateOfBirth,
          adresse: {
            rue: req.body.rue,
            ville: req.body.ville,
            codePostal: req.body.codePostal
          },
          tel: req.body.tel,
          chef: false,
          orders: [],
          userPreference: []
        });
        newProfil.save().then(newDoc => {
          res.json({ result: true, newDoc });
        });
      } else {
        res.status(500).json({ result: false, error: "Profil alrady create for this Userconnexion" });
      }
    }
  );
});

//RECUPERER TOUTES LES INFOS D'UN USER AVEC SON ID => Test TC OK sauf pour userPreference & orders
router.get('/:userProfilId', (req, res) => {
  UserProfil.findOne({ _id : req.params.userProfilId})
    .populate("adresse")
    .populate("userPreference")
    .populate("orders")
    .exec()
    .then((data) => {
      if (data) {
        res.json({result: true, data})
      } else {
        res.json({result: false, message: "profil utilisateur non trouvé"})
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ result: false, message: 'Erreur serveur' });
    });
});

//VOIR LE STATUE CHEF => Test TC OK
router.get('/chef/:userProfilId', (req, res) => {
  UserProfil.findOne({ _id : req.params.userProfilId})
    .then((data) => {
      if (data) {
        res.json({result: true, chef: data.chef})
      } else {
        res.json({result: false, message: "profil utilisateur non trouvé"})
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ result: false, message: 'Erreur serveur' });
    });
});

//AJOUTER UNE PREFERENCE => Test TC OK
router.put("/add-preference/:userProfilId", (req, res) => {
  const { userProfilId } = req.params;
  const { userPreference } = req.body;
  UserProfil.findOne({ _id: userProfilId })
    .then(data => {
      //console.log(data.userPreference);
      const samePreference = data.userPreference.filter(e => e === userPreference);
      if(samePreference.length === 0) {
        UserProfil.updateOne(
          { _id: userProfilId },
          { $push: { userPreference } }
        ).then((data) => {
          if (data.acknowledged === false) {
            res.status(500).json({ result: false, error: "noMatch" });
          } else {
            res.json({ result: true });
          }
        });
      } else {
        res.json({ result: false, message: "preference alrady exist"})
      }
    })
});

//SUPPRIMER UNE PREFERENCE => Test TC OK
router.put("/remove-preference/:userProfilId", (req, res) => {
  const { userProfilId } = req.params;
  const { userPreference } = req.body;
  UserProfil.findOne({ _id: userProfilId , })
    .then(data => {
      
      if (data) {
        if(data.userPreference.some(e=> e === userPreference )) {
          const removePreference = data.userPreference.filter(e => e !== userPreference);
          UserProfil.updateOne(
            { _id: userProfilId },
            { $set: { userPreference: removePreference }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'Preference remove' });
            }
          }));
        } else {
          res.json({result: false, message: "this preference don't exist here"})
        }
      } else {
        res.json({result: false, message:"user not find"})
      }
      }
)});


//AJOUTER UNE COMMANDE => Test TC OK
router.put("/update-order/:userProfilId", (req, res) => {
  const { userProfilId } = req.params;
  const { orderId } = req.body;
  UserProfil.findOne({ _id: userProfilId })
    .then(data => {
      const sameOrder = data.orders.filter(e => e.toString() === orderId);
      if(sameOrder.length === 0) {
        UserProfil.updateOne(
          { _id: userProfilId },
          { $push: { orders: orderId } }
        ).then((data) => {
          if (data.acknowledged === false) {
            res.status(500).json({ result: false, error: "noMatch" });
          } else {
            res.json({ result: true });
          }
        });
      } else {
        res.json({ result: false, message: "this order alrady exist"})
      }
    })
});

//SUPPRIMER UNE COMMANDE => PAS TESTE
router.put("/remove-order/:userProfilId", (req, res) => {
  const { userProfilId } = req.params;
  const { orderId } = req.body;
  UserProfil.findOne({ _id: userProfilId , })
    .then(data => {
      if (data) {
        if(data.userPreference.some(e=> e === userPreference )) {
          const removeOrder = data.orders.filter(e => e.toString() !== orderId);
          UserProfil.updateOne(
            { _id: userProfilId },
            { $set: { userPreference: removeOrder }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'Order remove' });
            }
          }));
        } else {
          res.json({result: false, message: "this preference don't exist here"})
        }
      } else {
        res.json({result: false, message:"user not find"})
      }
      }
)});

//METTRE A JOUR SON ADRESSE => Test TC OK
router.put('/:userId/update-adresse', async (req, res) => {
  const { userId } = req.params;
  const newAdresse = {
    rue: req.body.rue,
    ville: req.body.ville,
    codePostal: req.body.codePostal
  };
  UserProfil.findOne( {_id: userId})
    .then((data)=> {
      //Recherche adresse identique en comparant rue avec rue, etc.
      if (data.adresse.rue === req.body.rue && data.adresse.ville === req.body.ville && data.adresse.codePostal === req.body.codePostal ) {
        res.json({ result: false, message: 'Same Adresse'})
      } else {
        UserProfil.updateOne(
          { _id: userId },
          { $set: { adresse: newAdresse }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'Adresse change' });
            }
          }));
      }
  })
});


//METTRE A JOUR SON TEL => Test TC OK
router.put('/:userId/', async (req, res) => {
  const { userId } = req.params;
  const { newTel } = req.body;
  UserProfil.findOne( {_id: userId})
    .then((data)=> {
      if (data.tel === newTel) { //Tel identique à l'ancien
        res.json({ result: false, message: 'Same Tel'})
      } else {
        UserProfil.updateOne(
          { _id: userId },
          { $set: { tel: newTel }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'Tel change' });
            }
          }));
      }
  })
});

//METTRE A JOUR CHEF => Test TC OK
router.put('/:userId/update-chef', async (req, res) => {
  const { userId } = req.params;
  UserProfil.findOne( {_id: userId})
    .then((data)=> {
      let newStatus = !data.chef;
        UserProfil.updateOne(
          { _id: userId },
          { $set: { chef: newStatus }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, newStatus });
            }
          }));
  })
});
  
//SUPPRIMER UN PROFIL => Test TC OK
router.delete("/delete", (req, res) => {
  if (req.body.id === "") {
    res.status(500).json({ result: false, error: "Missing fields" });
  } else {
    UserProfil.deleteOne({ _id: req.body.id }).then((dataDeleted) => {
      console.log(dataDeleted);
      if (dataDeleted.deletedCount === 0) {
        res.status(500).json({ result: false, error: "Impossible to delete" });
      } else {
        res.json({ result: true });
      }
    });
  }
});



  
   
  
module.exports = router;
  