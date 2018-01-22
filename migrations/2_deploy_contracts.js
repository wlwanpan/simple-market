var SimpleMarket = artifacts.require('./SimpleMarket.sol')

module.exports = function(deployer) {
  deployer.deploy(SimpleMarket)
}