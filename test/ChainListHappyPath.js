//Contract to be tested
var ChainList = artifacts.require("./ChainList.sol");

// Test suite
contract('ChainList', function(accounts) {

  var ChainListInstance;
  var seller = account[1];
  var articleName = "article 1";
  var articleDescription = "Description from article 1";
  var articlePrice = 10;

  // Test case: check inital values
  it("should be initialized with empty values", function() {
    return ChainList.deployed().then(function(instance) {
      return instance.getArticle.call();
    }).then(function(data) {
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], '', "article must be empty");
      assert.equal(data[2], '', "description must be empty");
      assert.equal(data[3].toNumber(), 0, "article price must be zero");
    });
  });


});
