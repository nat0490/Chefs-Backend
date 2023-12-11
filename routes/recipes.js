const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipes');
const UserChef = require('../models/userChef');

router.post('/newrecipes', (req, res) => {
  UserChef.findById(req.user._id, (err, chef) => {
    if (err || !chef) {
      res.status(500).json({ result: false, error: 'Error finding chef' });
      return;
    }

    const newRecipe = new Recipes({
      userChef: chef._id,
      name: req.body.name,
      image: req.body.image,
      time: req.body.time,
      type: req.body.type,
      notes: req.body.notes,
      prix: req.body.prix,
      ustensils: req.body.ustensils,
      ingredients: req.body.ingredients,
    });

    newRecipe.save((err, savedRecipe) => {
      if (err) {
        res.status(500).json({ result: false, error: 'Error saving recipe' });
        return;
      }

      res.status(200).json({ result: true, savedRecipe });
    });
  });
});

module.exports = router;
