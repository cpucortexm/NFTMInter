import Minter from '../src/artifacts/contracts/NFTMinter.sol/NFTMinter.json'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'

let nftContract;

export const getMaxMintAmount = async () => {
  const result = await nftContract.maxSupply()
  return result.toNumber();
};

export const getTotalSupply = async () => {
  const result = await nftContract.totalSupply();
  return result.toNumber();
};

export const getOwnerBalance =  async (signerAddr) => {
  const result = await nftContract.balanceOf(signerAddr);
  return result.toNumber();
};

export const getNftPrice = async () => {
  const result = await nftContract.cost();
  return result.toString();
};

export const getSaleState = async () => {
  const result = await nftContract.saleIsActive();
  return result;
};

export const mintNFT = async(amount, priceformint) =>{
    try {
            const result = await nftContract.mint(amount, {value:priceformint});
            await result.wait();  // wait for Tx success i.e. mining to happen
     } catch (e) { console.log(e); }	       
   return 
};

export const getProviderAndSigner = ()=> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    return {provider, signer}
};

export const createContractInstance = async() =>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner() 
    nftContract = new ethers.Contract(process.env.NEXT_PUBLIC_NFTMINTER_ADDRESS, Minter.abi, signer)
    return nftContract
};