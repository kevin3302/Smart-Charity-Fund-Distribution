## Packages Required:-
- Truffle v5.11.5 (core: 5.11.5)
- Ganache v7.9.1
- Solidity v0.5.16 (solc-js)
- Node v18.8.2
- npm v9.8.1
- Web3.js v1.10.0

## Other Requirements:-
1. Any chromium based browser i.e. Chrome 
2. Metamask browser extension
    
## setup process 

1. Clone the project
```
git clone https://github.com/A4ANK/Fake-Product-Identification.git
```
2. Go to the project folder, open terminal there and run following command to install required node_modules:-
```
npm install
```
3. Compile contract source files. (Compilation and deployment can be done using truffle migrate):-
```
truffle compile
```
4. Open Ganache, (to setup local blockchain)
    - create new workspace
    - add truffle-config.js  in truffle project 
    - change port to 7545 in server settings (same as port in truffle-config.js)
5. In chrome, open metamask 
   - add new test network using  
        - NETWORK ID (i.e. 5777 ,from Ganache Server settings) 
        - RPC SERVER (i.e HTTP://127.0.0.1:7545 ,from Ganache Server settings)
        - CHAIN CODE (i.e. 1337)
   - import account using private key of any account from local blockchain available in Ganache.
6. In terminal, run following commands:-
- Run migrations to deploy contracts.
```
truffle migrate
```

- To start a server and it will open a homepage (index.html) file in the default browser.
```
npm start 
``` 
7. Login to metamask ,and connect the added account to local blockchain (i.e.localhost:3000)
8. Interact with website
