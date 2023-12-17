const express = require('express');
const router = express.Router();
const Ustensils = require('../models/ustensils');

// Pour creer  la bd des ustensils
router.post('/add', async (req, res) => {
    const ustensilsList = [
        { nom: 'Spatule', emoji: '🍳' },
        { nom: 'Louche', emoji: '🥣' },
        { nom: 'Fouet', emoji: '🧁' },
        { nom: 'Rouleau à pâtisserie', emoji: '🍰' },
        { nom: 'Tire-bouchon', emoji: '🍾' },
        { nom: 'Éplucheur', emoji: '🥔' },
        { nom: 'Presse-agrumes', emoji: '🍊' },
        { nom: 'Pinceau de cuisine', emoji: '🖌️' },
        { nom: 'Moulin à poivre', emoji: '🧂' },
        { nom: 'Balance de cuisine', emoji: '⚖️' },
        { nom: 'Couteau de chef', emoji: '🔪' },
        { nom: 'Ciseaux de cuisine', emoji: '✂️' },
        { nom: 'Planche à découper', emoji: '🪓' },
        { nom: 'Mandoline', emoji: '🔪' },
        { nom: 'Râpe', emoji: '🧀' },
        { nom: 'Passoire', emoji: '🕳️' },
        { nom: 'Tapis de cuisson', emoji: '🍪' },
        { nom: 'Cul-de-poule', emoji: '🥚' },
        { nom: 'Emporte-pièce', emoji: '🍪' },
        { nom: 'Zesteur', emoji: '🍋' },
        { nom: 'Ciseaux à herbes', emoji: '✂️' },
        { nom: 'Mixeur plongeant', emoji: '🥤' },
        { nom: 'Thermomètre de cuisine', emoji: '🌡️' },
        { nom: 'Entonnoir', emoji: '🕳️' },
        { nom: 'Fouet en spirale', emoji: '🌀' },
        { nom: 'Écumoire', emoji: '🥄' },
        { nom: 'Pilon', emoji: '🔨' },
        { nom: 'Cuillère en bois', emoji: '🥄' },
        { nom: 'Moule à gâteau', emoji: '🎂' },
        { nom: 'Epluche-légumes', emoji: '🥕' },
        { nom: 'Cuit-vapeur', emoji: '🥘' },
        { nom: 'Moulin à épices', emoji: '🧂' },
        { nom: 'Passe-thé', emoji: '🫖' },
        { nom: 'Rouleau à pizza', emoji: '🍕' },
        { nom: 'Décapsuleur', emoji: '🍺' },
        { nom: 'Moule à muffins', emoji: '🧁' },
        { nom: 'Pince de cuisine', emoji: '🔐' },
        { nom: 'Casserole', emoji: '🍲' },
        { nom: 'Poêle', emoji: '🍳' },
        { nom: 'Bol mélangeur', emoji: '🍲' },
        { nom: 'Tamis', emoji: '⚙️' },
        { nom: 'Émulsionneur', emoji: '🥛' },
        { nom: 'Rouleau à pâtisserie', emoji: '🍪' },
        { nom: 'Plateau de service', emoji: '🍽️' },
        { nom: 'Cuillère à glace', emoji: '🍨' },
        { nom: 'Théière', emoji: '🍵' },
        { nom: 'Sauteuse', emoji: '🥘' },
        { nom: 'Marqueur de température', emoji: '🌡️' },
        { nom: 'Pique à brochette', emoji: '🍢' },
        { nom: 'Chinois', emoji: '🕳️' },
        { nom: 'Pelle à tarte', emoji: '🥧' },
        { nom: 'Broyeur d\'ail', emoji: '🧄' }, 
        { nom: 'Plat à four', emoji: '🍲' },
        { nom: 'Passoire fine', emoji: '🕳️' },
        { nom: 'Râpe à zester', emoji: '🍋' },
        { nom: 'Louchette', emoji: '🥄' },
        { nom: 'Mandoline', emoji: '🥔' },
        { nom: 'Découpe-pizza', emoji: '🍕' },
        { nom: 'Tire-bouchon', emoji: '🍷' },
        { nom: 'Cuillère', emoji: '🥄' },
        { nom: 'Couteau', emoji: '🔪' },
        { nom: 'Fourchette', emoji: '🍴' },
        { nom: 'Spatule', emoji: '🍳' },
        { nom: 'Bol', emoji: '🥣' },
        { nom: 'Verre', emoji: '🥛' },
        { nom: 'Tasse', emoji: '☕' },
        { nom: 'Assiette', emoji: '🍽️' },
        { nom: 'Poêle', emoji: '🍳' },
        { nom: 'Marmite', emoji: '🍲' },
        { nom: 'Fouet', emoji: '🥚' },
        { nom: 'Balance', emoji: '⚖️' },
    ];

    Ustensils.create(ustensilsList)
        .then(createdUstensils => {
            res.json({ result: true, createdUstensils });
        })
       
});



// Récupération d'un ustensile par son ID depuis la base de données
router.get('/findby-id/:ustensilId', async (req, res) => {
    const { ustensilId } = req.params;
    
    // Recherche de l'ustensile dans la base de données par son ID
    Ustensils.findById(ustensilId)
        .then(foundUstensil => {
            if (!foundUstensil) {
                return res.status(404).json({ result: false, message: 'Ustensile non trouvé.' });
            }

            // Envoi de la réponse avec les détails de l'ustensile trouvé
            res.json({ result: true, ustensil: foundUstensil });
        })
        
});


// Récupération des ustensils avec son nom de la db
router.get('/findby-name/:nom', async (req, res) => {
    const { nom } = req.params; // Récupération du nom depuis les paramètres de l'URL
    
    // Recherche de l'ustensile dans la base de données par son nom
    Ustensils.findOne({ nom })
        .then(foundUstensil => {
            if (!foundUstensil) {
                return res.status(404).json({ result: false, message: 'Ustensile non trouvé.' });
            }

            

            // Envoi de la réponse avec le nom et l'emoji de l'ustensile trouvé
            res.json({ result: true, ustensil: { nom: foundUstensil.nom, emoji: foundUstensil.emoji } });
        })
        
});

//supprimer un ustensile par son id
router.delete("/:ustensileId/delete", (req, res) => {
    const { ustensileId } = req.params;
  
    if (!ustensileId) {
      res.status(400).json({ result: false, error: "Missing or invalid ustensileId" });
    } else {
      Ustensils.deleteOne({ _id: ustensileId }).then((dataDeleted) => {
        if (dataDeleted.deletedCount === 0) {
          res.status(404).json({ result: false, error: "Ustensile not found or impossible to delete" });
        } else {
          res.json({ result: true , message: 'Ustensile supprimé avec succès.'});
        }
      })
    }
  });

// Recupere tous les ustensils 
  router.get('/all', async (req, res) => {
    Ustensils.find({})
      .then(ustensils => {
        res.json({ result: true, ustensils });
      })
      .catch(error => {
        res.status(500).json({ result: false, error: error.message });
      });
  });
  

  

module.exports = router;
