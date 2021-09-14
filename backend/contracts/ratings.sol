pragma solidity >=0.4.24 <0.6.0;
pragma experimental ABIEncoderV2;
// pragma abicoderv2;
/**
  * @title Simple Storage
  * @dev Read and write values to the chain
  */

contract Ratings {

  uint productCount;
  uint scoreCount;

  constructor() public {
    scoreCount = 0;
  }

  struct Score {
    EnvImpact envImpact;
    uint upc;
    uint productionDate; // epoch time of product shipment
  }

  struct EnvImpact {
    bool plastics;
    bool pesticides;
    bool herbicides;
    bool nonrenewableEnergy;
  }

  mapping(uint => Score) private scores;

  function addScore(uint _upc, uint _productionDate, bool _plastics, 
      bool _herbicides, bool _pesticides, bool _nonrenewableEnergy) public returns (uint scoreId) {
    EnvImpact memory envImpact = EnvImpact(_plastics, _pesticides, _herbicides, _nonrenewableEnergy);
    scores[scoreCount] = Score(envImpact, _upc, _productionDate);
    return scoreCount++;
  }

  function getScoreTotal(uint _upc, uint _productionDate) public view returns (int score) {
    int scoreTotal = 0;
    int productScoreCount = 0;
    for(uint i = 0; i < scoreCount; i++) {
      // for each product id and date match, use score entry to calculate total score
      if(scores[i].upc == _upc && scores[i].productionDate == _productionDate) {
        scoreTotal += !scores[i].envImpact.pesticides ? 10 : 0;
        scoreTotal += !scores[i].envImpact.nonrenewableEnergy ? 10 : 0;
        scoreTotal += !scores[i].envImpact.plastics ? 10 : 0;
        scoreTotal += !scores[i].envImpact.herbicides ? 10 : 0;
        productScoreCount++;
      }
    }
    return productScoreCount == 0 ? -1 : scoreTotal/productScoreCount;
  }
  
  function getScoreCountPerProduct(uint _upc) private view returns (uint total) {
      uint total = 0;
      for(uint i=0; i < scoreCount; i++) {
        if(scores[i].upc == _upc) {
            total++;
        }
    }
    return total;
  }

  function getScoreHistory(uint _upc) public view returns (Score[] memory) {
    Score[] memory scoresForProduct = new Score[](getScoreCountPerProduct(_upc));
    uint count = 0;
    for(uint i=0; i < scoreCount; i++) {
        if(scores[i].upc == _upc) {
            scoresForProduct[count++] = scores[i];
        }
    }
    return scoresForProduct;
  }
  
}