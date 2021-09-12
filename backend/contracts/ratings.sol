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
    int rating;
    uint productId;
  }

  mapping(uint => Score) private scores;

  mapping(uint => Product) private products;

  function addProduct(string memory _name, string memory _manufacturer) public {
    products[productCount++] = Product(_name, _manufacturer);
  }

  function addScore(uint _productId, int _score) public {
    scores[scoreCount++] = Score(_score, _productId);
  }

  function getProduct(uint _productId) public view returns (string memory name, string memory manufacturer) {
    return (products[_productId].name, products[_productId].manufacturer);
  }

  function getScoreTotal(uint _productId) public view returns (int score) {
    int scoreTotal = 0;
    int productScoreCount = 0;
    for(uint i = 0; i < scoreCount; i++) {
      if(scores[i].productId == _productId) {
        productScoreCount++;
        scoreTotal += scores[i].rating; 
      }
    }
    return scoreTotal/productScoreCount;
  }
  
}