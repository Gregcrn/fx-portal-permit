const fs = require("fs");
const config = require("../config/config.json");
const FxERC20ChildTunnel = artifacts.require("FxERC20ChildTunnel");

module.exports = async function (deployer) {
    // Deploy the FxERC20ChildTunnel contract
    await deployer.deploy(FxERC20ChildTunnel, config.testnet.fxChild.address, config.testnet.fxERC20.address);
    const fxERC20ChildTunnel = await FxERC20ChildTunnel.deployed();

    config.testnet.fxChildTunnel.address = fxERC20ChildTunnel.address;
    fs.writeFileSync("./config/config.json", JSON.stringify(config, null, 2));

};
