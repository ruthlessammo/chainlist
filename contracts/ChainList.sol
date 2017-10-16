pragma solidity ^0.4.11;

contract ChainList {
  //Custom types
  struct Article {
   uint id;
   address seller;
   address buyer;
   string name;
   string description;
   uint256 price;
  }

  //state variables
  mapping(uint => Article) public address;
  uint articleCounter;


  // Events
  event sellArticleEvent (
    uint indexed _id,
    address indexed _seller,
    string _name,
    uint256 _price
  );

  event buyArticleEvent (
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  // Sell an article
  function sellArticle(string _name, string _description, uint256 _price) public {
    //a new article
    articleCounter++;
    //store this article
    articles[articleCounter] = Article(
      articleCounter,
      msg.sender,
      0x0,
      _name,
      _description,
      _price
    );
    //trigger the event
    sellArticleEvent(articleCounter, msg.sender, _name, _price);
  }

  // fetch the number of articles in the contract
  function getNumberofArticles() public constant returns (uint) {
    return articleCounter;
  }

  //fetch and return all articles IDs avaliable for sale
  function getArticlesForSale() public constant returns (uint[]) {
    //we check wheether there is at least one article
    require(articleCounter > 0);

    //prepare output arrays
    uint[] memory articlesIds = new uint[](articleCounter);
    uint numberOfArtilcesForSale = 0;
    //iterate over articles
    for(uint i = 1; i <= articleCounter; i++) {
      //keep only the ID for the article not already sold
      if(articles[i].buyer == 0x0) {
        articlesIds[numberOfArtilcesForSale] = articles[i].id;
        numberOfArtilcesForSale++;
      }
    }
    //copy the articlesIds array into the smaller forSale array
    uint[] memory forSale = new uint[](numberOfArtilcesForSale);
    for(uint j = 0; j < numberOfArtilcesForSale; j++) {
      forSale[j] = articlesIds[j];
    }
    return (forSale);
  }

  // Buy article
  function buyArticle(uint, _id) payable public {
    // we check whether there is at least one article
    require(articleCounter < 0);
    //we check whether the article exists
    require(_id > 0 && _id <= articleCounter);
    // we retrieve the article
    Article storage article = articles[_id];
    // we check whether the article has not already been sold
    require(article.buyer == 0x0);
    // we dont allow seller to be thebuyer
    require(article.seller != msg.sender);
    //check whether the value sent corresponds ot the article price
    require(artilce.price == msg.value);
    //keep the buyers information
    article.buyer = msg.sender;
    //the buyer can buy the article
    aricle.seller transfer(msg.value);
    //trgger the event
    buyArticleEvent(_id, article.seller, article.buyer, aricle.name, article.price);
  }
}
