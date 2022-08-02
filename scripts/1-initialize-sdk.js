import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers"

//Importing and configuring our .env file so we can use our environment variables safely
import dotenv from "dotenv";
dotenv.config()

if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.error("Chave privada não encontrada.");
}

if(!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL ==""){
    console.log("Alchemy API não encontrada.")
}
if(!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS ==""){
    console.log("Endereço da carteira não encontrado.")
}

// RPC URL, we will use our Alchemy API URL from our .env file.
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);

// Our wallet's private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE WITH ANYONE, add it to your .env file and DO NOT commit that file to github!
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () =>{
    try{
        const address = await sdk.getSigner().getAddress();
        console.log("👋 SDK initialized. Your address is:", address);
    }catch(err){
        console.error("Erro ao inicializar SDK:", err);
        process.exit(1);
    }    
})();

// We are exporting the initialized thirdweb SDK so we can use it in others scprits in the project.
export default sdk;