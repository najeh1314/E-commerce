const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


// Initialisation de l'application Express
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Autoriser uniquement cette origine
}));

// Configuration de Mongoose
mongoose.connect('mongodb://localhost:27017/productsDB', {});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String
});

const Product = mongoose.model('Product', productSchema);

// Fonction pour initialiser les données
async function seedData() {
    await Product.insertMany([
        { name: 'Laptop', category: 'Electronics', price: 1200.00, description: 'High performance laptop' },
        { name: 'Headphones', category: 'Electronics', price: 150.00, description: 'Noise-cancelling headphones' },
        { name: 'Coffee Maker', category: 'Appliances', price: 80.00, description: 'Automatic coffee maker' },
        { name: 'T-shirt', category: 'Clothing', price: 20.00, description: 'Cotton t-shirt' },
        { name: 'Book', category: 'Books', price: 15.00, description: 'Fiction novel' }
    ]);
}

// Point de terminaison pour ajouter un produit
app.post('/add-product', async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        const newProduct = new Product({ name, category, price, description });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Point de terminaison pour rechercher des produits
app.get('/search-products', async (req, res) => {
    try {
        const { name = '', category = '', min_price = 0, max_price = Number.MAX_VALUE } = req.query;
        const products = await Product.find({
            price: { $gte: parseFloat(min_price), $lte: parseFloat(max_price) },
            name: new RegExp(name, 'i'),
            category: new RegExp(category, 'i')
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lancement de l'application
(async () => {
    try {
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
        // pour initialiser avec des données de test
         await seedData();
    } catch (error) {
        console.error('Error starting server:', error);
    }
})();