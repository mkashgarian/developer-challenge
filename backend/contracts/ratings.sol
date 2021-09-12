pragma solidity >=0.4.24 <0.6.0;
/**
  * @title Simple Storage
  * @dev Read and write values to the chain
  */

contract Ratings {

  uint productCount;
  uint scoreCount;

  constructor() public {
    productCount = 0;
    scoreCount = 0;
  }

  struct Product {
    string name;
    string manufacturer;
  }

  struct Score {
    EnvImpact envImpact;
    uint productId;
    uint productionDate; // epoch time of product shipment
  }

  struct EnvImpact {
    bool plastics;
    bool pesticides;
    bool herbicides;
    bool nonrenewableEnergy;
  }

  mapping(uint => Score) private scores;

  mapping(uint => Product) private products;

  function addProduct(string memory _name, string memory _manufacturer) public returns (uint productId) {
    products[productCount] = Product(_name, _manufacturer);
    return productCount++;
  }

  function addScore(uint _productId, uint _productionDate, bool _plastics, 
      bool _herbicides, bool _pesticides, bool _nonrenewableEnergy) public returns (uint scoreId) {
    EnvImpact memory envImpact = EnvImpact(_plastics, _pesticides, _herbicides, _nonrenewableEnergy);
    scores[scoreCount] = Score(envImpact, _productId, _productionDate);
    return scoreCount++;
  }

  function getProduct(uint _productId) public view returns (string memory name, string memory manufacturer) {
    return (products[_productId].name, products[_productId].manufacturer);
  }

  function getScoreTotal(uint _productId, uint _productionDate) public view returns (int score) {
    int scoreTotal = 0;
    int productScoreCount = 0;
    for(uint i = 0; i < scoreCount; i++) {
      // for each product id and date match, use score entry to calculate total score
      if(scores[i].productId == _productId && scores[i].productionDate == _productionDate) {
        scoreTotal += !scores[i].envImpact.pesticides ? 10 : 0;
        scoreTotal += !scores[i].envImpact.nonrenewableEnergy ? 10 : 0;
        scoreTotal += !scores[i].envImpact.plastics ? 10 : 0;
        scoreTotal += !scores[i].envImpact.herbicides ? 10 : 0;
        productScoreCount++;
      }
    }
    return productScoreCount == 0 ? -1 : scoreTotal/productScoreCount;

  }
  
}