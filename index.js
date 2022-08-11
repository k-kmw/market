const express = require('express');
const app = express();
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/market', {useNewUrlParser: true})
.then(()=> {
    console.log('MONGO CONNECTION')
})
.catch((e)=> {
    console.log('Error', e);
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
categories = ['fruit', 'vegetable', 'dairy', 'drink']

app.get('/products', async (req, res) => {
    const {category} = req.query;
    // console.log(category);
    if(category) {
        const products = await Product.find({category: category});
        res.render('products', {products, category})
    } else {
        const products = await Product.find({})
        res.render('products', {products, category: "All Products"});
    }

})

app.get('/products/new', (req, res) => {
    res.render('new', {categories});
})

app.get('/products/:id', async (req, res) => {
    const {id} = req.params
    const product = await Product.findById(id);
    res.render('detail', {product})
})

app.post('/products', async (req, res)=> {
    // console.log(req.body);
    const newProduct = new Product(req.body)
    // console.log(newProduct);
    await newProduct.save();
    res.redirect(`products/${newProduct._id}`)
}) 

app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('edit', {product, categories});
})

app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    // console.log(req.body);
    await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    .then((r) => console.log(r))
    .catch((e) => console.log(e))
    res.redirect(`/products/${id}`);
})

app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    await Product.findByIdAndRemove(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log("LISTEN TO 3000 PORT!")
})