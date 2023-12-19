const mongoose = require('mongoose');

const UserChefAvailabilitySchema = new mongoose.Schema({
    userChef: { type: mongoose.Schema.Types.ObjectId, ref: 'userchefs' },

    availability: 
        {
          date: { type: Date, required: true },
      time: String , // Définir le type comme String pour stocker l'heure au format HH:MM
      isAvailable: { type: Boolean, default: true },
          
        },
});

const UserChefAvailability = mongoose.model('UserChefAvailability', UserChefAvailabilitySchema);

module.exports = UserChefAvailability;
