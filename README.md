# Bridging Assets with FxPortal on Goerli and Mumbai Networks

This project aims to bridge assets between the Goerli and Mumbai networks using the FxPortal. The following steps should be taken to set up the custom tunnel:

### Step 1: Deploy SafeToken contract on Goerli network

The SafeToken contract deploys a simple ERC20 token on the Goerli network. Please use ERC20Permit in your case.

### Step 2: Deploy FxERC20 template on Goerli network

The FxERC20 contract template creates new child tokens on the Mumbai network. The contract is initialized with the address of the FxPortal contract and the address of the corresponding token on the root network. It contains a mint function that the root network contract can use to mint new child tokens.

### Step 3: Deploy FxERC20Child contract on Mumbai network

The FxERC20Child contract is a child token minted by the root network contract. It is initialized with the address of the FxPortal contract, the address of the corresponding token on the root network, and the token’s name, symbol, and decimals. It contains a burn function that can be used to burn child tokens.

### Step 4: Deploy FxERC20RootTunnel contract on Goerli network

The FxERC20RootTunnel contract is responsible for mapping tokens from the root network to the child network and sending deposits to the child network. When a new token is mapped, the contract deploys a new child token contract using the FxERC20 template.

Constructor arguments:

`_checkpointManager: 0x2890bA17EfE978480615e330ecB65333b880928e
_fxRoot: 0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA
_fxERC20Token: FxERC20 address (address of FxERC20 template created in step 2)`

### Step 5: Deploy FxERC20ChildTunnel contract on Mumbai network

The FxERC20ChildTunnel contract is responsible for processing messages from the root network and minting new child tokens, as well as handling child-to-root withdrawals.

Constructor arguments:

`_fxChild: 0xCf73231F28B7331BBe3124B907840A94851f9f11
_tokenTemplate: FxERC20 address (address of FxERC20 template created in step 3)`

### Step 6: Connect the tunnels

On the FxERC20ChildTunnel contract (step 5), set the setFxRootTunnel function. This should be done with the FxERC20RootTunnel contract address from step 4.

On the FxERC20RootTunnel contract (step 4), set the setFxChildTunnel function. This should be done with the FxERC20ChildTunnel contract address from step 5.

### Step 7: Deposit assets

Now the custom tunnel is ready to bridge assets. On the FxERC20RootTunnel contract from step 4, call the deposit function with the SafeToken on the Goerli network from step 1.

Congratulations! You have successfully bridged assets between the Goerli and Mumbai networks using the FxPortal.

### Important

-   You need to call the 'approve' function on the safeERC20 contract by passing FxERC20RootTunnel contract address and token amount as a parameter
-   I recommend verifying the contract and directly interacting with the setFxRootTunnel and setFxChildTunnel function on Mumbai's PolygonScan and Goerli's Etherscan to ensure that there are no issues with the script :

*   On the FxERC20RootTunnel contract on Mumbai, call the setFxChildTunnel function with the FxERC20ChildTunnel contract address (from mumbai) as the input data.
*   On the FxERC20ChildTunnel contract on Goerli, call the setFxRootTunnel function with the FxERC20RootTunnel contract address (from goerli) as the input data.
*   To get the childToken address, go to the FxERC20RootTunnel contract's read section and find the 'rootToChildTokens' function. Input the safeERC20 token address, and you will get the address of the childToken that you need to put into MetaMask
