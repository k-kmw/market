const mongoose = require('mongoose');
const Product = require('./product');
const {Schema} = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name!']
    },
    city: String,
    email: {
        type: String,
        required: [true, 'Email required']
    },
    products: [
        {
            type: Schema.Types.ObjectId, 
        ref: 'Product'
        }
    ]
})

farmSchema.post('findOneAndDelete', async (farm) => {
    if(farm.products.length) {
        const res = await Product.deleteMany({_id: {$in: farm.products}})
        // console.log(res);
    }
    
})
const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;

// const makeFarm = async() => {
//     const farm = new Farm({name: 'cocoland', city: 'yangsan'})
//     const melon = await Product.findOne({name: 'melon'})
//     farm.products.push(melon)
//     await farm.save();
//     console.log(farm)
// }

// makeFarm();

// const addProduct = async() => {
//     const farm = await Farm.findOne({name: 'cocoland'});
//     const watermelon = await Product.findOne({name:'watermelon'})
//     farm.products.push(watermelon);
//     await farm.save();
//     console.log(farm);
// }

// Farm.findOne({name: 'cocoland'})
//     .populate('products')
//     .then(res => console.log(res))