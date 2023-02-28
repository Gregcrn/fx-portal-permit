const config = require('../config/config.json');

const FxERC20RootTunnel = artifacts.require("FxERC20RootTunnel");

module.exports = async function (deployer) {
    // Deploy the FxERC20RootTunnel contract
    await deployer.deploy(FxERC20RootTunnel, config.testnet.checkpointManager.address, config.testnet.fxRoot, config.testnet.fxERC20Child.address);
};
