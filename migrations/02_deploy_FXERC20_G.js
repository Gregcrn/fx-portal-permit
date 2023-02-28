const FxERC20 = artifacts.require('FxERC20');
const config = require('../config/config.json');
const fs = require('fs');

module.exports = async function (deployer) {
    // get the address of msg.sender
    const [deployerAddress] = await web3.eth.getAccounts();

    // Address of the fxManager contract on the Polygon network
    const fxManagerAddress = deployerAddress;

    // Address of the root token on the Ethereum network
    const connectedTokenAddress = config.testnet.fxERC20Permit.address;

    // Token metadata
    const name = 'Fx VLDPermit';
    const symbol = 'Fx_VLDP';
    const decimals = 18;

    // Deploy the FxERC20 contract
    await deployer.deploy(FxERC20);
    const fxERC20 = await FxERC20.deployed();

    // Write the contract address to a file
    config.testnet.fxERC20.address = fxERC20.address;
    fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));

    // Initialize the FxERC20 contract
    await fxERC20.initialize(
        fxManagerAddress,
        connectedTokenAddress,
        name,
        symbol,
        decimals
    );
};
