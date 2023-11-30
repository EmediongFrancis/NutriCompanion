const mongoose = require('mongoose');

// Define the schema based on the database entry
const foodItemSchema = new mongoose.Schema({
    Id: Number,
    REFID: Number,
    Code: String,
    Category: String,
    EnglishName: String,
    ScientificName: String,
    Source: Number,
    ENERGY_kJ: Number,
    ENERGY_kcal: Number,
    WATER_g: Number,
    PROTEIN_g: Number,
    FAT_g: Number,
    CHO_g: Number,
    FIB_g: Number,
    ASH_g: Number,
    Ca_mg: Number,
    Fe_mg: Number,
    Mg_mg: Number,
    P_mg: Number,
    K_mg: Number,
    Na_mg: Number,
    Zn_mg: Number,
    Cu_mg: Number,
    VITE_mg: Number,
    THIA_mg: Number,
    RIBF_mg: Number,
    NIAEQ_mg: Number,
    VIT_B6_mg: Number,
    FOL_mcg: Number,
    SearchName: String,
});

// Create a Mongoose model using the schema
const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
