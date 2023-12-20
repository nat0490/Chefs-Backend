const express = require('express');
const router = express.Router();
const UserChef = require('../models/userChef');
const NodeGeocoder = require('node-geocoder')

// Pour cree un userchef
router.post('/upgradeToChef/:userId', (req, res) => {
  const userId = req.params.userId;
  UserChef.findOne({ userProfil: userId })
    .then(existingUser => {
      if (existingUser === null) {
        const newUserChef = new UserChef({
          spécialisation: req.body.spécialisation,
          userCompliment: [],
          experience: req.body.experience,
          passion: req.body.passion,
          services: req.body.services,
          userProfil: userId,
          recipes: [],
        });

        newUserChef.save().then(newDoc => {
          res.json({ result: true, newDoc });
        })
      } else {
        res.status(500).json({ result: false, error: 'Profile already exists for this user' });
      }
    })
    
});

//CREER ET AJOUTER UNE RECETTE
router.put('/addRecipe/:userChefId', (req, res) => {
  const { userChefId } = req.params;
  const { recipeId } = req.body;
  UserChef.findOne({ _id: userChefId})
    .then(existingUser => {
      if (existingUser) {
        UserChef.updateOne(
          { _id: userChefId },
          { $push: { recipes: recipeId } }
        ).then((data) => {
          //console.log(data);
          if (data.nModified === 0) {
            res.status(500).json({ result: false, error: "noMatch" });
          } else {
            res.json({ result: true, message: "recipe added" });
          }
        });
      } else {
        res.json({ result: false, message: "no user found"})
      }
    })
})



// Récupérer les informations d'un UserChef par Id
router.get('/:userChefId', (req, res) => {
  UserChef.findOne({ _id: req.params.userChefId })
    .populate("userProfil")
    .populate("recipes")
    .exec()
    .then(data => {
      if (data) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false, message: "UserChef profile not found" });
      }
    })
});

// routes pour récup tout les chef. TC OK
router.get('/', (req,res) => {
  UserChef.find({})
  .populate("userProfil")
  .populate('recipes')
  .then(data => {
    if(data){
      res.json({ result: true, data }) // je veux afficher les recettes 
    }
    else {
      res.json({ result: false, message: "UserChef profile not found" });
    }
  })
});


// Récupérer les informations d'un UserChef par ProfilId
router.get('/find/:profilId', (req, res) => {
  UserChef.findOne({ userProfil: req.params.profilId })
    .populate('recipes')
    .populate('userProfil')
    .populate('userCompliment')
    .exec()
    .then(data => {
      if (data) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false, message: "UserChef profile not found" });
      }
    })
    
});


//METTRE A JOUR  spécialisation 
router.put('/:userChefId/updatespecialisation', async (req, res) => {
  const { userChefId } = req.params;
  const { newspécialisation } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.spécialisation === newspécialisation) { //spécialisation identique à l'ancien
        res.json({ result: false, message: 'Same spécialisation'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { spécialisation: newspécialisation }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'spécialisation change' });
            }
          }));
      }
  })
});


// Mettre à jour les userCompliment  d'un UserChef
router.put('/:userChefId/addCompliment', async (req, res) => {
  const { userChefId } = req.params;
  const { newsuserCompliment } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.userCompliment === newsuserCompliment) { //userCompliment identique à l'ancien
        res.json({ result: false, message: 'Same userCompliment'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $push: { userCompliment: newsuserCompliment }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'userCompliment change' });
            }
          }));
      }
  })
});




//METTRE A JOUR  l'experience 
router.put('/:userChefId/updateexperience', async (req, res) => {
  const { userChefId } = req.params;
  const { newsexperience } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.experience === newsexperience) { //experience identique à l'ancien
        res.json({ result: false, message: 'Same experience'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { experience: newsexperience}}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'experience change' });
            }
          }));
      }
  })
});


//METTRE A JOUR la passion 
router.put('/:userChefId/updatepassion', async (req, res) => {
  const { userChefId } = req.params;
  const { newspassion } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.passion === newpassion) { //passion identique à l'ancien
        res.json({ result: false, message: 'Same passion'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { passion: newspassion }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'passion change' });
            }
          }));
      }
  })
});


//METTRE A JOUR  le services 
router.put('/:userChefId/updateservices', async (req, res) => {
  const { userChefId } = req.params;
  const { newservices } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.services === newservices) { //services identique à l'ancien
        res.json({ result: false, message: 'Same services'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { services: newservices }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'services change' });
            }
          }));
      }
  })
});

// Supprimer un UserChef
router.delete("/:userChefId/delete", (req, res) => {
  UserChef.deleteOne({ _id: req.params.userChefId }).then(dataDeleted => {
    if (dataDeleted.deletedCount === 0) {
      res.status(500).json({ result: false, error: "Unable to delete" });
    } else {
      res.json({ result: true });
    }
  });
});


;






// Configuration du géocodeur avec l'API Mapbox
const options = {
  provider: 'mapbox',
  apiKey: 'sk.eyJ1Ijoiam9uYWhhcnQiLCJhIjoiY2xxNmZnOG00MHU4cTJpbnV2dG9xeWo2aCJ9.aLXDwUzwKlUML5cZxklWwg', // Remplace par ton propre jeton d'accès Mapbox
};

const geocoder = NodeGeocoder(options);

// Route pour récupérer les adresses et les convertir en coordonnées géographiques
router.get('/userchefs/addresses', async (req, res) => {
  
  const chefs = await UserChef.find({}).populate('userProfil');

  if (chefs) {
    const addresses = [];
    for (const chef of chefs) {
      if (chef.userProfil && chef.userProfil.adresse) {
        const addressDetails = chef.userProfil.adresse;
        const fullAddress = `${addressDetails.rue}, ${addressDetails.ville}, ${addressDetails.codePostal}`;
        
        const result = await geocoder.geocode(fullAddress);
        if (result.length > 0) {
          addresses.push({
            userId: chef._id,
            address: fullAddress,
            coordinates: {
              latitude: result[0].latitude,
              longitude: result[0].longitude,
            },
          });
        } else {
          console.error(`Aucun résultat pour ${fullAddress}`);
        }
      }
    }
    res.json(addresses);
  } else {
    res.status(404).json({ message: 'Aucun UserChef trouvé.' });
  }

});







module.exports = router;










