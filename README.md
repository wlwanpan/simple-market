# Simple Market

Experimental Secret Market Dapp: https://simple-market.herokuapp.com

The smart contract is currently deployed on the public ropsten testnet:

- https://ropsten.etherscan.io/address/0xff34e514e58e6683d83892ecdfda52fd48321748

1. Install metamask extension - https://metamask.io/
2. Switch metamask network from "Main Ethereum Network" to "Ropsten Test Net"
3. Load testnet wallet by claiming ETH from: http://faucet.ropsten.be:3001/

Note: Still figuring out a way host the dapp via IPFS instead of heroku.

## Running locally:

- NodeJs (https://nodejs.org/en/)
- testrpc (https://www.npmjs.com/package/ethereumjs-testrpc)
- Geth (https://github.com/ethereum/go-ethereum/wiki/geth)

##

Clone repo:
```
git clone https://github.com/wlwanpan/simple-market.git
```

Install dependencies:
```
cd simple-market && npm install
```

Start geth testrpc:
```
testrpc --rpc
```

Deploy a dummy contract:
```
truffle compile && truffle migrate
```

Serve frontend:
```
npm run dev
```

Attach node console to testrpc:
```
geth attach http://127.0.0.1:8545/
```

## Contract Address

0xff34e514e58e6683d83892ecdfda52fd48321748
