# NFT Minter - Polygon (token name- 'PNM')

## Setup steps

- git clone or download the source code

  ```
    $ git clone https://github.com/cpucortexm/NFTMint.git
  ```

- Install the node modules using
  ```
  $ yarn
  ```
- Rename .env.example to .env and enter the follwing
  1. ALCHEMY API URL (create ALCHEMY API if you dont have one)
  2. POLYGON MUMBAI TESTNET ACCOUNT PRIVATE KEY from the Metamask

## Running the App for Polygon Mumbai

```
 $ yarn dev
```

This will start the app with the UI and each wallet can currently mint a max of 5 PNM tokens.You can use the counter to increase or decrease the count of token mint. User has to mint atleast 1 token.

Contract address on Polygon Mumbai:
0xd939B84b6e9Bd6458AbDdf0d4c7Ac51c6Fc80093

Contract is already verified
