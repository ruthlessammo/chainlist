// Contract to be tested
var ChainList = artifacts.require("./ChainList.sol");

// Test suite
contract('ChainList', function(accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "article 1";
  var articleDescription = "Description for article 1";
  var articlePrice = 10;


  //Tets case : no article for sale yet
  it("should throw an exception if you try to buy an article when there is no article for sale," function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.buyArticle({
        from: buyer,
        value: web3.toWei(articlePrice, "ether")
      });
    }).then(assert.fail)
    .catch(function(error) {
      assert(error.message.indexOf('invalid opcode') >= 0, "error should be invalid opcode");
    }).then(function() {
      return chainListInstance.getArticle.call();
    }).then(function(data) {
      //make sure contract state was not altered
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2], '', "article name must be empty");
      assert.equal(data[3], '', "article description must be empty");
      assert.equal(data[4].toNumber(), 0, "article price must be 0");
    });
  });
});
