/* eslint-disable no-useless-concat */
import{useAddress, useMetamask, useEditionDrop} from '@thirdweb-dev/react';
import {useState, useEffect} from 'react';

const App = () => {
  // Using the hooks thirdweb gives us
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  console.log("Address:", address);

  // initialize the editionDrop contract
  const editionDrop = useEditionDrop("0x81d8950aeA472C1d3c39D11379102542e6194491");
  // State variable to know if the user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming helps us know if it is in the loading state while the NFT is minted.
  const [isClaiming,setIsClaiming] = useState(false);


  useEffect(() => {
    // If he doesn't have a wallet attached, leave!
    if(!address){
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        // If the balance is greater than 0, it has our NFT!
        if(balance.gt(0)){
          setHasClaimedNFT(true);
          console.log("🐴 Esse usuário tem o NFT de membro!");
        } else {
          setHasClaimedNFT(false);
          console.log("💀 Esse usuário não tem o NFT de membro!");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.log("Falha ao ler saldo", error);
      } 
    };
    checkBalance();
  }, [address, editionDrop])

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Cunhado com sucesso! Olhe na OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
        setHasClaimedNFT(false);
        console.error("Falha ao cunhar NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  if(!address) {
    return (
      <div className="landing">
        <h1>Bem vindo à XGoHorseDAO - A única opção é a mais rápida! 🚀</h1>
        <button onClick={connectWithMetamask}>
          Conecte sua carteira
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="landing">
        <h1>Bem-vindo Dev. Resolveu o problema? Compilou? Commit e era isso. 🏆</h1>
        {setHasClaimedNFT ? `🌊 Seu NFT na OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0` : ""}
      </div>
    )
  }

  // Render the NFT minting screen
  return (
    <div className="mint-nft">
      <h1>Cunhe gratuitamente seu NFT de membro 🐴 da XGoHorseDAO</h1>
      <button disable={isClaiming.toString()} onClick={mintNft}>
        {isClaiming ? "Cunhando..." : "Cunhe seu NFT (GRÁTIS)"} 
      </button>
    </div>
  );
};

export default App
