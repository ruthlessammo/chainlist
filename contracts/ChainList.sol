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

  // get the article
  function getArticle() public constant returns (
    address _seller,
    address _buyer,
    string _name,
    string _description,
    uint256 _price) {
    return(seller, buyer, name, description, price);
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
