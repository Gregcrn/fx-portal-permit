const fs = require('fs');
const config = require("../config/config.json")
const VldPermit = artifacts.require("VldPermit");

// async function to deploy the contract
module.exports = async function (deployer, accounts) {
    // check if the contract is already deployed
    if (VldPermit.isDeployed()) {
        return;
    }
    // deploy the contract
    await deployer.deploy(VldPermit, "VLDPermit", "VLDP");
    // get the deployed contract instance
    const vldPermit = await VldPermit.deployed();
    // get the contract address
    const vldPermitAddress = vldPermit.address;
    // write the contract address to a file
    config.testnet.fxERC20Permit.address = vldPermitAddress;
    fs.writeFileSync("./config/config.json", JSON.stringify(config, null, 2));

};