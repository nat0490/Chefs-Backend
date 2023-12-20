const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipes');
const UserChef = require('../models/userChef');
const { checkBody } = require('../modules/checkBody');



//Créer une recette
router.post('/newrecipes/:userChefId', (req, res) => {
  //Vérification des informations saisis
  /*
  if (!checkBody(req.body, ['title', 'image', 'time', 'type', 'minimum', 'personneSup', 'panierCourseParPersonne', 'name', 'quantity', 'unit'])) {
    res.status(500).json({ result: false, error: 'Missing or empty fields' });
    return;
  }*/
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
        feedback : [],
        type: req.body.type,
        notes: [],
        prix: {
          minimum: req.body.minimum,
          personneSup: req.body.personneSup,
          panierCourseParPersonne: req.body.panierCourseParPersonne,
        },
        ustensils:req.body.ustensils,
        ingredients: {//req.body.ingredients.map(ingredient => ({
          name: req.body.name,
          quantity: req.body.quantity,
          unit: req.body.unit,
        //})
        },
      });
      // Sauvegarder la nouvelle recette
      newRecipe.save()
        .then(data => {
          res.status(201).json({ result: true, data });
          
        })
        
    })
    
    
});


//CREER UNE RECETTE ET METTRE ID DANS USERCHEF
router.post('/newrecipesV2/:chefId', async (req, res) => {
  try {
    const {chefId} = req.params;

    // Vérifier si une recette existe déjà pour ce chef
    const existingRecipe = await Recipes.findOne({ userChef: chefId, title: req.body.title });

    if (existingRecipe) {
      return res.status(400).json({ result: false, error: 'title already exists for this chef' });
    }

    // Créer une nouvelle recette
    const newRecipe = new Recipes({
      userChef: chefId,
      title: req.body.title,
      image: req.body.image,
      time: req.body.time,
      feedback: [],
      type: req.body.type,
      notes: [],
      prix: {
        minimum: req.body.minimum,
        personneSup: req.body.personneSup,
        panierCourseParPersonne: req.body.panierCourseParPersonne,
      },
      ustensils: req.body.ustensils,
      ingredients: req.body.ingredients.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      }))
    
  });

    // Sauvegarder la nouvelle recette
    const savedRecipe = await newRecipe.save();

    // Mettre à jour l'utilisateur chef avec l'ID de la nouvelle recette
    const updatedUserChef = await UserChef.findOneAndUpdate(
      { _id: chefId },
      { $push: { recipes: savedRecipe._id } },
      { new: true }
    );

    res.status(201).json({ result: true, data: savedRecipe, updatedUserChef });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});


//SUPPRIMER UNE RECETTE + DANS PROFIL CHEF
router.delete("/delete/:recipeId", (req, res) => {
  if (req.params.recipeId === "" || req.body.chefId === "") {
    res.status(500).json({ result: false, error: "Missing fields" });
  } else {
    Recipes.deleteOne({ _id: req.params.recipeId })
      .then((dataDeleted) => {
      console.log(dataDeleted);
      if (dataDeleted.deletedCount === 0) {
        res.status(500).json({ result: false, error: "Impossible to delete" });
      } else {
        res.json({ result: true });
        UserChef.findOne({ _id: req.body.chefId})
        .then(data => {
          if (data) {
            UserChef.updateOne(
              { _id: req.body.chefId},
              { $pull: { recipes: req.params.recipeId } },
            ).then(data => {
              //MODIFIER ICI
              console.log(data);
              res.json(data);
            })
          } else {
            res.json({result: false, message: 'user not found'})
          }
        })
      }
    });
  }
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



// routes pour récup toutes les recettes. TC OK
router.get('/', (req,res) => {
  Recipes.find({})
  .populate('ingredients')
  .populate('ustensils')
  .populate('feedback')
  .populate('userChef')
  .exec()
  .then(recipes => {
      res.json({ result: true, recipes }) // je veux afficher les recettes 
  })
});



// Récupérer les informations d'une recette spécifique
router.get('/displayRecipes/:recipeId', (req, res) => {
  //const recipeId = '657f241b4a4338fb4a3d4927';
  const {recipeId} = req.params;
  Recipes.findOne({ _id: recipeId })
  .populate('userChef')
  .populate({
    path: 'userChef',
    populate: {
      path: 'userProfil',
      model: 'userProfil',
    },
  })
    .then(recipe => {
      console.log('Recipes:', recipe);  // Ajoutez cette ligne
      if (recipe) {
        res.json({ result: true, recipe });
      } else {
        res.json({ result: false, message: 'Recipe not found' });
      }
    })
    .catch(error => {
      console.error('Error retrieving recipes:', error);
      res.status(500).json({ result: false, message: 'Internal server error' });
    });
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



 //AJOUTER UNE NOTE 
 router.put('/:recipeId/updatenotes', async (req, res) => {
  const { recipeId } = req.params;
  const { newnotes } = req.body;
  Recipes.findOne( {_id: recipeId})
    .then(recipeFind => {
      if (recipeFind) { 
        Recipes.updateOne(
          { _id: recipeId },
          { $push: { notes: newnotes }}
        ).then((data) => {
          //console.log(data);
          if (data.nModified === 0) {
            res.status(500).json({ result: false, error: "noMatch" });
          } else {
            res.json({ result: true, message: "note added" });
          }
      });
      } else {
        res.json({ result: false, message: "no recipe found"})
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





// Route pour récupérer les recettes d'un chef spécifique
router.get('/recipes/:chefId', async (req, res) => {
  const chefId = req.params.chefId;

  // Récupérer les recettes du chef depuis la base de données en utilisant l'ID du chef
  Recipes.find({ userchef: chefId })
    .then(chefRecipes => {
      res.json({ result: true, chefRecipes });
    })
    .catch(error => {
      console.error('Error fetching chef recipes:', error);
      res.status(500).json({ result: false, error: 'Internal Server Error' });
    });
});




module.exports = router;
