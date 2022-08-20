const express = require('express');
const app = express();
const path = require('path')
const methodOverride = require('method-override')
const sessions = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Product = require('./models/product');
const Farm = require('./models/farm');

mongoose.connect('mongodb://localhost:27017/market2', {useNewUrlParser: true})
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
const sessionOption = {
    secret:'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: false
}
app.use(sessions(sessionOption));
app.use(flash());
categories = ['fruit', 'vegetable', 'dairy', 'drink']

app.use((req, res, next) => {
    res.locals.messages = req.flash('success');
    next();
})

// Farms Route
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    // console.log(farms)
    res.render('farms/index', {farms})
})

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.get('/farms/:id', async (req, res) => {
    const {id} = req.params;
    // console.log(req.params);
    const farm = await Farm.findById(id).populate('products')
    // console.log(farm);
    res.render('farms/detail', {farm})
})

app.get('/farms/:id/products/new', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', {farm, categories});
})

app.post('/farms/:id/products', async(req, res) => {
    const {id} = req.params;
    const product = new Product(req.body);
    const farm = await Farm.findById(id);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`)
})

app.post('/farms', async(req, res) => {
    const farm = new Farm(req.body);
    // console.log(farm);
    await farm.save();
    req.flash('success', 'made new farm!')
    res.redirect('/farms')
})

app.delete('/farms/:id', async(req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms')
})


// products Route
app.get('/products', async (req, res) => {
    const {category} = req.query;
    // console.log(category);
    if(category) {
        const products = await Product.find({category: category});
        res.render('products/products', {products, category})
    } else {
        const products = await Product.find({})
        res.render('products/products', {products, category: "All Products"});
    }

})

app.get('/products/new', (req, res) => {
    res.render('products/new', {categories});
})

app.get('/products/:id', async (req, res) => {
    const {id} = req.params
    const product = await Product.findById(id);
    res.render('products/detail', {product})
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
    res.render('products/edit', {product, categories});
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