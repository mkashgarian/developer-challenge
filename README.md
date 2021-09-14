# Sustainability Supply Chain

The purpose of this app is to create a system where consumers are able to look up their food before buying to see how 
sustainable the manufacturing process was for that exact item. This will help consumers to make more informed decisions about which food products they should buy and which they may want to avoid.

The process will go as follows:

1) A manufacturer (ie Smithfield) will start the manufacturing process on a product (ie bacon) and they will add the product (manufacturer name, product name, and UPC) to the app.

2) For every step of the bacon making process (raising pigs, slaughtering, curing meat, packaging, etc.), whatever company/farm/etc. is working on that step will go to the app and add a score. On this page, they will enter the UPC and the start date of manufacturing on that product. Then they will be presented with a series of questions to assess how sustainable their practices were with this particular batch of food. Their answers will be converted to a score of 0 to 100, where 100 is the most sustainable/eco friendly, and 0 is the least.

3) Finally, when a consumer is shopping, they will be able to pick up some food item, enter the UPC and the manufacturing date printed on the package, and they will be presented with a score. This 0 to 100 score will based on an average of the daily scores given to each step of the manufacturing process. They will also be able to see a chart of the overall sustainability scores of this product over time, to see if the process is getting better or worse overall.

### Start it up

Make sure you have docker installed as it will be used to run MongoDB.

```
# Start up docker in one terminal
cd backend
docker compose -up
cd ..

# Start the backend in another terminal
cd backend
npm i
npm start
cd ..

# Start a dev server for your react app in another terminal
# Note the package.json sets `"proxy": "http://localhost:4000"` to pass through API calls to the backend
cd frontend
npm i
npm start
cd ..

# If you want to add fake products to MongoDB (this will delete existing products):
cd backend
node productSeed.js
```

