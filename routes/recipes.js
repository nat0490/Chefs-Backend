const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipes');

router.post('/newrecipes/:chefId', (req, res) => {
  const chefId = req.params.chefId;

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
        .catch(err => {
          res.status(500).json({ result: false, error: 'Error creating recipe', err });
        });
    })
    
    
});

module.exports = router;
