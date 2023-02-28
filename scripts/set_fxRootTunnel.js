require('dotenv').config();
const config = require('../config/config.json');
const Web3 = require('web3');
// const { default: BigNumber } = require('bignumber.js');
const Tx = require('ethereumjs-tx').Transaction;
const fs = require('fs');

const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_TESTNET;
const web3 = new Web3(`https://rpc-mumbai.maticvigil.com/v1/${MUMBAI_PRIVATE_KEY}`);

const ChildTunnelABI = require('../build/contracts/FxERC20ChildTunnel.json').abi;
const FxERC20ChildTunnelAddress = config.testnet.FxERC20ChildTunnel.address;
const FxERC20RootTunnelAddress = config.testnet.fxERC20RootTunnel.address;

const FxERC20ChildTunnel = new web3.eth.Contract(ChildTunnelABI, FxERC20ChildTunnelAddress);

async function sendRawTransaction(rawTx) {
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(rawTx, (err, hash) => {
            if (err) {
                reject(err);
            }
            resolve(hash);
        });
    });
}

async function main() {
    const nonce = await web3.eth.getTransactionCount(process.env.USER_ADDRESS, 'latest');
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 500000;
    const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');

    const functionSignature = FxERC20ChildTunnel.methods.setFxRootTunnel(FxERC20RootTunnelAddress).encodeABI();
    const txParams = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: FxERC20ChildTunnelAddress,
        value: '0x00',
        data: functionSignature,
    };

    // TX with txParams and mumbai chain
    const tx = new Tx({ ...txParams, chainId: 80001 });
    console.log(tx)
    tx.sign(privateKey);

    const serializedTx = tx.serialize();
    const rawTx = '0x' + serializedTx.toString('hex');

    const hash = await sendRawTransaction(rawTx);
    console.log(`Transaction hash: ${hash}`);

    const receipt = await web3.eth.getTransactionReceipt(hash);
    console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);

    config.hash.setFxRootTunnel.address = hash;
    // save hash to config file
    fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });