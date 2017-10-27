App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: () => {
    return App.initWeb3();
  },

  initWeb3: () => {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: () => {
    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
        $("#account").text(account);
        web3.eth.getBalance(account, (err, balance) => {
          if (err === null) {
            $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
          }
        });
      }
    });
  },

  initContract: () => {
    $.getJSON('ChainList.json', (chainListArtifact) => {
      // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
      App.contracts.ChainList = TruffleContract(chainListArtifact);

      // Set the provider for our contract.
      App.contracts.ChainList.setProvider(App.web3Provider);

      // Listen for events
      App.listenToEvents();

      // Retrieve the article from the smart contract
      return App.reloadArticles();
    });
  },

  reloadArticles: () => {
    // avoid reentry
    if (App.loading) {
      return;
    }
    App.loading = true;

    // refresh account information because the balance may have changed
    App.displayAccountInfo();

    let chainListInstance;

    App.contracts.ChainList.deployed().then((instance) => {
      chainListInstance = instance;
      return chainListInstance.getArticlesForSale();
    }).then((articleIds) => {
      // Retrieve and clear the article placeholder
      const articlesRow = $('#articlesRow');
      articlesRow.empty();

      for (let i = 0; i < articleIds.length; i++) {
        var articleId = articleIds[i];
        chainListInstance.articles(articleId).then((article) => {
          App.displayArticle(
            article[0],
            article[1],
            article[3],
            article[4],
            article[5]
          );
        });
      }
      App.loading = false;
    }).catch((err) => {
      console.log(err.message);
      App.loading = false;
    });
  },

  displayArticle: (id, seller, name, description, price) => {
    // Retrieve the article placeholder
    const articlesRow = $('#articlesRow');

    const etherPrice = web3.fromWei(price, "ether");

    // Retrieve and fill the article template
    const articleTemplate = $('#articleTemplate');
    articleTemplate.find('.panel-title').text(name);
    articleTemplate.find('.article-description').text(description);
    articleTemplate.find('.article-price').text(etherPrice + " ETH");
    articleTemplate.find('.btn-buy').attr('data-id', id);
    articleTemplate.find('.btn-buy').attr('data-value', etherPrice);

    // seller?
    if (seller == App.account) {
      articleTemplate.find('.article-seller').text("You");
      articleTemplate.find('.btn-buy').hide();
    } else {
      articleTemplate.find('.article-seller').text(seller);
      articleTemplate.find('.btn-buy').show();
    }

    // add this new article
    articlesRow.append(articleTemplate.html());
  },

  sellArticle: () => {
    // retrieve details of the article
    let _article_name = $("#article_name").val();
    let _description = $("#article_description").val();
    let _price = web3.toWei(parseFloat($("#article_price").val() || 0), "ether");

    if ((_article_name.trim() == '') || (_price == 0)) {
      // nothing to sell
      return false;
    }

    App.contracts.ChainList.deployed().then(function(instance) {
      return instance.sellArticle(_article_name, _description, _price, {
        from: App.account,
        gas: 500000
      });
    }).then((result) => {

    }).catch((err) => {
      console.error(err);
    });
  },

  // Listen for events raised from the contract
  listenToEvents: () => {
    App.contracts.ChainList.deployed().then((instance) => {
      instance.sellArticleEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        $("#events").append('<li class="list-group-item">' + event.args._name + ' is for sale' + '</li>');
        App.reloadArticles();
      });

      instance.buyArticleEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        $("#events").append('<li class="list-group-item">' + event.args._buyer + ' is for sale' + '</li>');
        App.reloadArticles();
      });
    });
  },

  buyArticle: () => {
    event.preventDefault();

    // retrieve the article price
    let _articleId = $(event.target).data('id');
    let _price = parseFloat($(event.target).data('value'));

    App.contracts.ChainList.deployed().then((instance) => {
      return instance.buyArticle(_articleId, {
        from: App.account,
        value: web3.toWei(_price, "ether"),
        gas: 500000
      });
    }).then((result) => {

    }).catch((err) => {
      console.error(err);
    });
  },
};

$(() => {
  $(window).load(() => {
    App.init();
  });
});
