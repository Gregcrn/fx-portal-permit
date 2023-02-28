const config = require('../config/config.json');
const fs = require('fs');

const FxERC20RootTunnel = artifacts.require("FxERC20RootTunnel");

module.exports = async function (deployer) {
    // Deploy the FxERC20RootTunnel contract
    await deployer.deploy(FxERC20RootTunnel, config.testnet.checkpointManager.address, config.testnet.fxRoot.address, config.testnet.fxERC20.address);
    const fxERC20RootTunnel = await FxERC20RootTunnel.deployed();
    // Write the contract address to a file
    config.testnet.fxERC20RootTunnel.address = fxERC20RootTunnel.address;
    fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));

};
