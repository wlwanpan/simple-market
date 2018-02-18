# Simple Market

Experimental Secret Market Dapp: https://simple-market.herokuapp.com

The smart contract (address below) is currently deployed on the public ropsten testnet.
Switch metamask from "Main Ethereum Network" to "Ropsten Test Net" and if you need some ETH to mess around, visit http://faucet.ropsten.be:3001/ and paste your metamask testnet account address to claim 3 ETH.

Note: Still figuring out a way host the dapp via IPFS instead of heroku.

## Requirements to run locally:

- NodeJs (https://nodejs.org/en/)
- testrpc (https://www.npmjs.com/package/ethereumjs-testrpc)
- Geth (https://github.com/ethereum/go-ethereum/wiki/geth)
- Metamask (https://metamask.io/)

## 

Start geth testrpc:
```
testrpc --rpc
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

0x8b6302b8505d50ab32a4ecb8c27736b0cca33f35
