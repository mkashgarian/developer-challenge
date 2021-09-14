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
  mapping(uint => uint) private productScoreCounts;

  function addScore(uint _upc, uint _productionDate, bool _plastics, 
      bool _herbicides, bool _pesticides, bool _nonrenewableEnergy) public returns (uint scoreId) {
    EnvImpact memory envImpact = EnvImpact(_plastics, _pesticides, _herbicides, _nonrenewableEnergy);
    scores[scoreCount] = Score(envImpact, _upc, _productionDate);
    productScoreCounts[_upc] +=1;
    return scoreCount++;
  }

  // this will get score total for a product made on a specific date & the processes it went through
  function getScoreTotal(uint _upc, uint _productionDate) public view returns (Score[] memory) {
    Score[] memory scoresForProductAndDate = new Score[](getScoreCountPerProductAndDate(_upc, _productionDate));
    uint count = 0;
    for(uint i=0; i < scoreCount; i++) {
        if(scores[i].upc == _upc && scores[i].productionDate == _productionDate) {
            scoresForProductAndDate[count++] = scores[i];
        }
    }
    return scoresForProductAndDate;
  }
  
  function getScoreCountPerProductAndDate(uint _upc, uint _productionDate) private view returns (uint total) {
      for(uint i=0; i < scoreCount; i++) {
        if(scores[i].upc == _upc && scores[i].productionDate == _productionDate) {
            total++;
        }
    }
    return total;
  }

  // this will get a history of ALL products with this UPC no matter the date, and 
  // the actual scores will be calculated and averaged by day on the backend
  function getScoreHistory(uint _upc) public view returns (Score[] memory) {
    Score[] memory scoresForProduct = new Score[](productScoreCounts[_upc]);
    uint count = 0;
    for(uint i=0; i < scoreCount; i++) {
        if(scores[i].upc == _upc) {
            scoresForProduct[count++] = scores[i];
        }
    }
    return scoresForProduct;
  }
  
}