import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
//import Minter from './abi/contracts/NFTMinter.sol/NFTMinter.json'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import {
  getMaxMintAmount,
  getTotalSupply,
  getNftPrice,
  mintNFT,
  getOwnerBalance,
  getSaleState,
  getProviderAndSigner,
  createContractInstance
} from "../utils/interact"

const MAX_PER_WALLET = 5;

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
  const [buttonText, setButtonText] = useState("Mint NFT");
  const [minter, setMinter] = useState(false)
  const [nftPrice, setNftPrice] = useState('0.01')
  const [IPFSImagePath, setIPFSImagePath]  = useState('https://gateway.pinata.cloud/ipfs/QmNj4KFqMxyZGAkwXnCVpRjdTWho4TXifo6greUa7LWMJP')
  const [count, setCount] = useState(1);
  const [maxMintAmount, setmaxMintAmount] = useState(0)
  const [totalSupplyAmount, setTotalSupply] = useState(0)
  // If wallet is already connected...
  useEffect( () => {
    if(! hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
 
    const prepare = async () => {
      const {provider, signer} = getProviderAndSigner()
      try {
        const signerAddress = await signer.getAddress()
        setConnectedWalletAddressState(`${signerAddress}`)
      } catch {
        setConnectedWalletAddressState('No wallet connected')
        return;
      }
      const contract = createContractInstance()
      setNftPrice(ethers.utils.formatEther(await getNftPrice()));
      setmaxMintAmount(await getMaxMintAmount())
      setTotalSupply(await getTotalSupply())
    };
     prepare();
  },[])
  
  // Request access to MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  const incrementCount = () => {
    if (count < maxMintAmount) {
      setCount(count + 1);
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };



   // Call smart contract, set new value
  const onMintPressed = async (amount) => {
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    await requestAccount()
    const {provider, signer} = getProviderAndSigner()
    const signerAddress = await signer.getAddress()
    setConnectedWalletAddressState(`${signerAddress}`)
    const contract = createContractInstance()


    try{

        let ownertokenbalance = await getOwnerBalance(signerAddress)
        let maxSupply =  maxMintAmount  //await getMaxMintAmount()
        let totalSupply = totalSupplyAmount // await getTotalSupply()
        if ((amount.count + ownertokenbalance <= MAX_PER_WALLET) && totalSupply <= maxSupply){ // MAX_PER_WALLET -1 because count starts from 0
              let cost = await getNftPrice()
              let valueformint = (cost*(amount.count)).toString(); // value must be in string
              console.log("ownertokenbalance", ownertokenbalance)
              const response = await mintNFT(amount.count, valueformint); // Wei
              setMinter(true)              
              let tokenId = await getTotalSupply();
              setIPFSImagePath(IPFSImagePath + '/' + tokenId + '.png')
              console.log("Token URI and image:", IPFSImagePath + '/' + tokenId + '.png')
          }
        else{ // Comes here only when minting is not possible due to max limit exceeded
              if(totalSupply > maxSupply) // exceeded max supply
              {
                setButtonText("Max Supply Exceeded");
              }
              else{
                setButtonText(`Max Per Wallet-${MAX_PER_WALLET}`);
              }
          }        
    }catch(error){
      console.log("error:", error);
    }
  }
   
  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>PolygonNFTMinter</title>
        <meta name="description" content="UI to interact with Polygon NFT Minter." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        { ! process.env.NEXT_PUBLIC_NFTMINTER_ADDRESS ? (
            <p className="text-md">
              Please add a value to the <pre>NEXT_PUBLIC_NFTMINTER_ADDRESS</pre> environment variable.
            </p>
        ) : (
          <>
            <h1 className="text-4xl font-semibold mb-8">
              NFT Polygon Minter
            </h1>
            <div className="space-y-8">
                <div className="space-y-8">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white ml-4 font-bold py-2 px-4 rounded-full" onClick={()=>{onMintPressed( {count})}}>
                      {buttonText}
                    </button>
                    <text >  Price: {nftPrice} Matic + Gas</text>

                    {/* Minted NFT Ratio */}
                    <p className="bg-gray-100 rounded-md text-gray-800 font-extrabold text-lg mr-24 ">
                    <span className="text-purple-600">{`${totalSupplyAmount}`}</span> /
                      {maxMintAmount}
                    </p>
                    <div className="flex items-center text-3xl font-bold text-gray-200 ml-14">
                                  <button
                                    className="flex items-center justify-center w-12 h-12 pl-4 ml-6 bg-white rounded-md text-black hover:bg-red-400 text-center"
                                      onClick={incrementCount}
                                  >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-red-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 4v16m8-8H4"
                                    />
                                    </svg>
                                  </button>

                                  <h2 className="mx-8 text-gray-400">{count}</h2>

                                  <button
                                      className="flex items-center justify-center w-12 h-12  bg-white rounded-md hover:bg-red-400 text-center"
                                        onClick={decrementCount}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-6 h-6 text-red-700"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 12H4"
                                          />
                                        </svg>
                                  </button>
                    </div>
                </div>

               <div>
                  { connectedWalletAddress && <p class="text-black font-bold justify-center mr-12">Connected wallet: </p> }
                  { connectedWalletAddress && <text class="text-teil-500">{connectedWalletAddress}</text> }
                </div>
            </div>
          </>
        ) }
      </main>

      <footer className="mt-20 mr-10">
        <a
          href="https://github.com/cpucortexm/NFTMint/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-700"
        >
          Read the docs
        </a>
        <a> Author: Yogesh K (yogidk@gmail.com)</a>
      </footer>
    </div>
  )
}
