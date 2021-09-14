global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder; 
const { MongoClient } = require('mongodb');


const { MONGO_URI } = require('./config');


async function seed() {
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();

    const ratingsDb = mongoClient.db('ratings');
    const collection = ratingsDb.collection('product');

    const randomUPC = () => Math.floor(100000000000 + Math.random() * 900000000000);

    const data = [
        {
            name: 'Center Cut Bacon',
            manufacturer: 'Smithfield Foods',
            UPC: randomUPC()
        },
        {
            name: 'Tomato Ketchup',
            manufacturer: 'Kraft Heinz Company',
            UPC: randomUPC()
        },
        {
            name: 'Evian',
            manufacturer: 'Danone',
            UPC: randomUPC()
        },
        {
            name: 'Fresh Boneless Skinless Chicken Breasts',
            manufacturer: 'Tyson Foods, Inc.',
            UPC: randomUPC()
        },
        {
            name: 'Snickers',
            manufacturer: 'Mars, Inc.',
            UPC: randomUPC()
        },
        {
            name: 'Bonless Skinless Turkey Breast Filets',
            manufacturer: 'Perdue Farms',
            UPC: randomUPC()
        },
        {
            name: 'Stonyfield Organic Milk',
            manufacturer: 'Lactalis',
            UPC: randomUPC()
        },
        {
            name: 'Tasty Tom',
            manufacturer: 'Olam International',
            UPC: randomUPC()
        },
        {
            name: 'FreshYo Drinking Yoghurt',
            manufacturer: 'Olam International',
            UPC: randomUPC()
        },
        {
            name: 'Soybeans',
            manufacturer: 'CHS Inc',
            UPC: randomUPC()
        },
        {
            name: 'Hot Italian Chicken Sausage',
            manufacturer: 'Tyson Foods, Inc.',
            UPC: randomUPC()
        },
        {
            name: 'Instant Pot Creamy Stroganoff Beef & Noodle',
            manufacturer: 'Tyson Foods, Inc.',
            UPC: randomUPC()
        },
        {
            name: 'Dasani Water',
            manufacturer: 'The Coca-Cola Company',
            UPC: randomUPC()
        },
        
        {
            name: 'Organic Eggs',
            manufacturer: 'Pete and Gerry\'s Organics LLC, Mid-Atlantic',
            UPC: randomUPC()
        },
        {
            name: 'San Marzano Tomatoes',
            manufacturer: 'Cento Fine Food',
            UPC: randomUPC()
        },
        {
            name: 'Stella Romano Cheese',
            manufacturer: 'Saputo Cheese USA Inc.',
            UPC: randomUPC()
        },
        {
            name: 'Chiquita Bananas',
            manufacturer: 'Safra Group',
            UPC: randomUPC()
        },
        {
            name: 'Budweiser',
            manufacturer: 'Anheuser-Busch Companies, LLC',
            UPC: randomUPC()
        },
        {
            name: 'Gerber Organic Carrot Baby Food',
            manufacturer: 'Nestlé S.A.',
            UPC: randomUPC()
        },
        {
            name: 'Dreyer\'s Slow Churned Ice Cream',
            manufacturer: 'Nestlé S.A.',
            UPC: randomUPC()
        },
        {
            name: 'Pike Place Roast',
            manufacturer: 'Starbucks Corporation',
            UPC: randomUPC()
        },
        {
            name: 'Doritos',
            manufacturer: 'Pepsico',
            UPC: randomUPC()
        },
        {
            name: 'Green Giant Broccoli Cuts',
            manufacturer: 'B&G Foods',
            UPC: randomUPC()
        },
        {
            name: 'Tomato Soup',
            manufacturer: 'Campbell Soup Company',
            UPC: randomUPC()
        },
        {
            name: 'Nutri-Grain',
            manufacturer: 'Kellogg Company',
            UPC: randomUPC()
        }
    ];
    await collection.insertMany(data);
    console.log(`Product data added.`);
    process.exit(1);
};

seed().catch(err => {
    console.error(err.stack);
    process.exit(1);
  });