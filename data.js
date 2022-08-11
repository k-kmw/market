const mongoose = require('mongoose');
const Product = require('./models/product');
const Prodcut = require('./models/product')

mongoose.connect('mongodb://localhost:27017/market', {useNewUrlParser: true})
.then(()=> {
    console.log('MONGO CONNECTION')
})
.catch((e)=> {
    console.log('Error', e);
})
const seedProducts = [
    {
        name: 'Egg',
        price: 500,
        category: 'dairy'
    },
    {
        name:'tomato',
        price: 300,
        category: 'vegetable'
    }, 
    {
        name: 'watermelon',
        price: 5000,
        category: 'fruit'
    },
    {
        name: 'soju',
        price: 2000,
        category: 'drink'
    },
    {
        name: 'coke',
        price: 1300,
        category: 'drink'
    },
    {
        name: 'apple',
        price: 500,
        category: 'fruit'
    }

]

Product.insertMany(seedProducts)
.then((res) => console.log(res))
.catch((e) => console.log(e))
