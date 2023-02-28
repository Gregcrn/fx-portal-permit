require('dotenv').config();
const config = require('../config/config.json');
const web3 = require('web3');

const erc20PermitABI = require('../build/contracts/ERC20Permit.json').abi;
const fxERC20ABI = require('../build/contracts/FxERC20.json').abi;

const Web3 = new web3(`https://goerli.infura.io/v3/${process.env.INFURA_ID}`);

const privateKey = process.env.PRIVATE_KEY;
const account = Web3.eth.accounts.privateKeyToAccount(privateKey);

const erc20PermitContract = new Web3.eth.Contract(
    erc20PermitABI,
    config.testnet.fxERC20Permit.address
);

const fxERC20Contract = new Web3.eth.Contract(
    fxERC20ABI,
    config.testnet.fxERC20.address
);

const transferData = fxERC20Contract.methods.transfer(
    fxERC20Contract.options.address,
    Web3.utils.toWei('10000', 'ether')
).encodeABI();

erc20PermitContract.methods.transfer(
    fxERC20Contract.options.address,
    Web3.utils.toWei('10000', 'ether')
)
    .send({
        from: account.address,
        gas: 50000,
        data: transferData
    })
    .then((tx) => {
        console.log('Transaction Hash:', tx.transactionHash);
    })
    .catch((err) => {
        console.error('Error:', err);
    });
