# Simple Market

https://simple-market.herokuapp.com

## Requirements:

- NodeJs (https://nodejs.org/en/)
- testrpc (https://www.npmjs.com/package/ethereumjs-testrpc)
- Geth (https://github.com/ethereum/go-ethereum/wiki/geth)

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
