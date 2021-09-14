const request = require('request-promise-native')
const express = require('express');
const app = express();
const archiver = require('archiver');
const Swagger = require('swagger-client');
const {URL} = require('url');
const bodyparser = require('body-parser');
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const { MongoClient } = require('mongodb');
const { post } = require('request');
const _ = require('lodash');

const SCORE_ASSIGNMENTS = {
  "herbicides": 15,
  "pesticides": 20,
  "plastics": 30,
  "nonrenewableEnergy": 35
};

let swaggerClient; // Initialized in init()
let fromAddress;
let mongoClient;

async function loadConfig() {
  const { MONGO_URI } = require('./config');

  mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();

  const db = mongoClient.db('ratings');
  const collection = db.collection('config');

  const config = {};
  await collection.find({}).toArray().then((configs) => {
    configs.map((c) => config[c.key] = c.value);
  });

  return config;
}

app.use(bodyparser.json());


app.post('/api/contract', async (req, res) => {
  // Note: we really only want to deploy a new instance of the contract
  //       when we are initializing our on-chain state for the first time.
  //       After that the application should keep track of the contract address.
  try {
    let postRes = await swaggerClient.apis.default.constructor_post({
      body: {},
      "kld-from": fromAddress,
      "kld-sync": "true"
    });
    res.status(200).send(postRes.body)
    console.log("Deployed instance: " + postRes.body.contractAddress);
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body)}\n${err.stack}`});
  }
});


// add product
app.post('/api/product', async (req, res) => {
  try {
    const db = mongoClient.db('ratings');
    const collection = db.collection('product');

    let response = await collection.insertOne({
      name: req.body.name, 
      manufacturer: req.body.manufacturer,
      UPC: req.body.upc
    })
    res.status(200).send(response)
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// get product
app.get('/api/product/:upc', async (req, res) => {
  try {
    const db = mongoClient.db('ratings');
    const collection = db.collection('product');
    let response = await collection.findOne({ UPC: parseInt(req.params.upc) });
    if(response == null) {
      res.status(404).send('product not found');
    } else {
      res.status(200).send(response);
    }
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// get all products
app.get('/api/product', async (req, res) => {
  try {
    const db = mongoClient.db('ratings');
    const collection = db.collection('product');
    let response = await collection.find({}).toArray();
    res.status(200).send(response);
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// add score
app.post('/api/score', async (req, res) => {
  try {
    const db = mongoClient.db('ratings');
    const collection = db.collection('config');
    const contractAddress = await collection.findOne({ key: "CONTRACT_ADDRESS" });
    const epochTime = new Date(req.body.productionDate).getTime()/1000;
    let postRes = await swaggerClient.apis.default.addScore_post({
      address: contractAddress.value,
      body: {
        _upc: req.body.upc,
        _productionDate: epochTime,
        _plastics: req.body.plastics,
        _herbicides: req.body.herbicides,
        _pesticides: req.body.pesticides,
        _nonrenewableEnergy: req.body.nonrenewableEnergy
      },
      "kld-from": fromAddress,
      "kld-sync": "true"
    });
    res.status(200).send(postRes.body)
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// get score total
app.get('/api/score/:upc/:date', async (req, res) => {
  try {
    const db = mongoClient.db('ratings');
    const collection = db.collection('config');
    const contractAddress = await collection.findOne({ key: "CONTRACT_ADDRESS" });
    const epochTime = new Date(req.params.date).getTime()/1000;
    let postRes = await swaggerClient.apis.default.getScoreTotal_get({
      address: contractAddress.value,
      _upc: parseInt(req.params.upc),
      _productionDate: epochTime,
      "kld-from": fromAddress,
      "kld-sync": "true"
    });
    res.status(200).send(postRes.body)
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

// get all scores (with dates) for a product - plus product name and manufacturer
app.get('/api/score/:upc', async (req, res) => {
  try {
    const db = mongoClient.db('ratings');
    const collection = db.collection('config');
    const contractAddress = await collection.findOne({ key: "CONTRACT_ADDRESS" });
    let postRes = await swaggerClient.apis.default.getScoreHistory_get({
      address: contractAddress.value,
      _upc: parseInt(req.params.upc),
      "kld-from": fromAddress,
      "kld-sync": "true"
    });
    let chartPoints = [];
    // group score entries by date
    let scoreByDate = _.groupBy(postRes.body.output, function(scoreEntry) {
      return scoreEntry.productionDate;
    })
    Object.keys(scoreByDate).map((scoreDate) => {
      let score = calculateScore(scoreByDate[scoreDate]);
      let date = new Date(0);
      date.setUTCSeconds(scoreDate);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDay();
      chartPoints.push([scoreDate*1000, score]);
    })
    res.status(200).send(chartPoints);
  }
  catch(err) {
    console.log(JSON.stringify(err, null, 1));
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

function calculateScore(dateRecords) {
  let score = 0;
  dateRecords.map((dateRecord) => {
    Object.keys(dateRecord.envImpact).map((impact) => {
      if(impact in SCORE_ASSIGNMENTS) {
        score += !dateRecord.envImpact[impact] ? SCORE_ASSIGNMENTS[impact] : 0;
      }
    });
  })
  return Math.floor(score/dateRecords.length);
}

// check if upc exists
app.get('/api/:upc', async (req, res) => {
  try {
    const db = mongoClient.db('ratings');
    const collection = db.collection('product');
    const response = await collection.findOne({ UPC: parseInt(req.params.upc) });
    if(response == null) {
      res.status(200).send(false);
    } else {
      res.status(200).send(true);
    }
  }
  catch(err) {
    res.status(500).send({error: `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`});
  }
});

async function init() {
  const {
    KALEIDO_REST_GATEWAY_URL,
    KALEIDO_AUTH_USERNAME,
    KALEIDO_AUTH_PASSWORD,
    PORT,
    FROM_ADDRESS,
    CONTRACT_MAIN_SOURCE_FILE,
    CONTRACT_CLASS_NAME
  } = await loadConfig();
  fromAddress = FROM_ADDRESS;

  // Kaleido example for compilation of your Smart Contract and generating a REST API
  // --------------------------------------------------------------------------------
  // Sends the contents of your contracts directory up to Kaleido on each startup.
  // Kaleido compiles you code and turns into a REST API (with OpenAPI/Swagger).
  // Instances can then be deployed and queried using this REST API
  // Note: we really only needed when the contract actually changes.  
  const url = new URL(KALEIDO_REST_GATEWAY_URL);
  url.username = KALEIDO_AUTH_USERNAME;
  url.password = KALEIDO_AUTH_PASSWORD;
  url.pathname = "/abis";
  var archive = archiver('zip');  
  archive.directory("contracts", "");
  await archive.finalize();
  let res = await request.post({
    url: url.href,
    qs: {
      compiler: "0.5", // Compiler version
      source: CONTRACT_MAIN_SOURCE_FILE, // Name of the file in the directory
      contract: `${CONTRACT_MAIN_SOURCE_FILE}:${CONTRACT_CLASS_NAME}` // Name of the contract in the 
    },
    json: true,
    headers: {
      'content-type': 'multipart/form-data',
    },
    formData: {
      file: {
        value: archive,
        options: {
          filename: 'smartcontract.zip',
          contentType: 'application/zip',
          knownLength: archive.pointer()    
        }
      }
    }
  });
  // Log out the built-in Kaleido UI you can use to exercise the contract from a browser
  url.pathname = res.path;
  url.search = '?ui';
  console.log(`Generated REST API: ${url}`);
  
  // Store a singleton swagger client for us to use
  swaggerClient = await Swagger(res.openapi, {
    requestInterceptor: req => {
      req.headers.authorization = `Basic ${Buffer.from(`${KALEIDO_AUTH_USERNAME}:${KALEIDO_AUTH_PASSWORD}`).toString("base64")}`;
    }
  });

  // Start listening
  app.listen(PORT, () => console.log(`Kaleido DApp backend listening on port ${PORT}!`))
}

init().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
  

module.exports = {
  app
};
