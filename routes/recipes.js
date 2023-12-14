const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipes');

router.post('/newrecipes/:userChefId', (req, res) => {
  const chefId = req.params.userChefId;

  // Vérifier si une recette existe déjà pour ce chef
  Recipes.findOne({ userChef: chefId ,  title: req.body.title, })
    .then(existingRecipe => {
      if (existingRecipe) {

      
        // Si une recette existe déjà pour ce chef, renvoyer un message indiquant que la recette existe
        return res.status(400).json({ result: false, error: 'title already exists for this chef' });
      }

      // Si aucune recette n'existe pour ce chef, créer une nouvelle recette
      const newRecipe = new Recipes({
        userChef: chefId,
        title: req.body.title,
        image: req.body.image,
        time: req.body.time,
        type: req.body.type,
        //=> note client donc pas obligatoire lors de la création d'une recette
        //notes: req.body.notes,
        prix: {
          minimum: req.body.minimum,
          personneSup: req.body.personneSup,
          panierCourseParPersonne: req.body.panierCourseParPersonne,
        },
        ustensils:req.body.ustensils,
        ingredients: {
          name: req.body.ingredientsName,
          quantity: req.body.ingredientsQuantity,
          unit: req.body.ingredientsUnit,
        },
      });

      // Sauvegarder la nouvelle recette
      newRecipe.save()
        .then(savedRecipe => {
          res.status(201).json({ result: true, savedRecipe });
        })
        
    })
    
    
});


// Récupérer les informations d'une recette spécifique
router.get('/:recipeId', (req, res) => {
  const recipeId = req.params.recipeId;

  Recipes.findOne({ _id: recipeId })
    .then(recipe => {
      if (recipe) {
        res.json({ result: true, recipe });
      } else {
        res.json({ result: false, message: 'Recipe not found' });
      }
    })
  
});

 //METTRE A JOUR  l'image
router.put('/:recipeId/updateimage', async (req, res) => {
  const { recipeId } = req.params;
  const { newimage } = req.body;
  Recipes.findOne( {_id: recipeId})
    .then((data)=> {
      if (data.image === newimage) { //title identique à l'ancien
        res.json({ result: false, message: 'Same image'})
      } else {
        Recipes.updateOne(
          { _id: recipeId },
          { $set: { image: newimage }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'image change' });
            }
          }));
      }
  })
});





 //METTRE A JOUR  le title de la recipes 
 router.put('/:recipeId/updatetitle', async (req, res) => {
  const { recipeId } = req.params;
  const { newtitle } = req.body;
  Recipes.findOne( {_id: recipeId})
    .then((data)=> {
      if (data.title === newtitle) { //title identique à l'ancien
        res.json({ result: false, message: 'Same title'})
      } else {
        Recipes.updateOne(
          { _id: recipeId },
          { $set: { title: newtitle }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'title change' });
            }
          }));
      }
  })
});



 //METTRE A JOUR  le temps 
 router.put('/:recipeId/updatetime', async (req, res) => {
  const { recipeId } = req.params;
  const { newtime } = req.body;
  Recipes.findOne( {_id: recipeId})
    .then((data)=> {
      if (data.time === newtime) { //time identique à l'ancien
        res.json({ result: false, message: 'Same time'})
      } else {
        Recipes.updateOne(
          { _id: recipeId },
          { $set: { time: newtime }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'time change' });
            }
          }));
      }
  })
});

 //METTRE A JOUR  le type 
 router.put('/:recipeId/updatetype', async (req, res) => {
  const { recipeId } = req.params;
  const { newtype } = req.body;
  Recipes.findOne( {_id: recipeId})
    .then((data)=> {
      if (data.type === newtype) { //type identique à l'ancien
        res.json({ result: false, message: 'Same type'})
      } else {
        Recipes.updateOne(
          { _id: recipeId },
          { $set: { type: newtype }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'type change' });
            }
          }));
      }
  })
});





 //METTRE A JOUR  le notes 
 router.put('/:recipeId/updatenotes', async (req, res) => {
  const { recipeId } = req.params;
  const { newnotes } = req.body;
  Recipes.findOne( {_id: recipeId})
    .then((data)=> {
      if (data.notes === newnotes) { //notes identique à l'ancien
        res.json({ result: false, message: 'Same notes'})
      } else {
        Recipes.updateOne(
          { _id: recipeId },
          { $set: { notes: newnotes }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'notes change' });
            }
          }));
      }
  })
});


//METTRE A JOUR  le prix
router.put('/:recipeId/updateprix', async (req, res) => {
  const { recipeId } = req.params;
  const newprix = {
    minimum: req.body.minimum,
    personneSup: req.body.personneSup,
    panierCourseParPersonne: req.body.panierCourseParPersonne,
  };
  Recipes.findOne( {_id: recipeId})
    .then((data)=> {
      //Recherche prix identique en comparant 
      if (data.prix.minimum === req.body.minimum 
        && data.prix.personneSup === req.body.personneSup 
        && data.prix.panierCourseParPersonne === req.body.panierCourseParPersonne ) {
        res.json({ result: false, message: 'Same prix'})
      } else {
        Recipes.updateOne(
          { _id: recipeId },
          { $set: { prix: newprix }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'prix change' });
            }
          }));
      }
  })
});


//METTRE A JOUR  le ingredients
router.put('/:recipeId/updateingredients', async (req, res) => {
  const { recipeId } = req.params;
  const newingredients = {
    name: req.body.name ,
    quantity: req.body.quantity ,
    unit: req.body.unit,
  };
  Recipes.findOne( {_id: recipeId})
    .then((data)=> {
      //Recherche ingredientsSchema identique en comparant 
      if (data.ingredients.name === req.body.name 
        && data.ingredients.quantity === req.body.quantity 
        && data.ingredients.unit === req.body.unit ) {
        res.json({ result: false, message: 'Same ingredients'})
      } else {
        Recipes.updateOne(
          { _id: recipeId },
          { $set: { ingredients: newingredients }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'ingredients change' });
            }
          }));
      }
  })
});




module.exports = router;
