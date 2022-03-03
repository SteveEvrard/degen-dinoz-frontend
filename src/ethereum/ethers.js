import { ethers } from "ethers";
import DegenDinoz from './abi/abi.json';

export const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;

export const contractAddress = '0xF0001c301295476f3F027877C54f568d3B3a3311';

export const signer = provider ? provider.getSigner() : null;

export const DegenDinozContract = new ethers.Contract(contractAddress, DegenDinoz.abi, provider);
export const DegenDinozSignedContract = DegenDinozContract.connect(signer);