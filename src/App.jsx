import{useAddress, useMetamask, useEditionDrop} from '@thirdweb-dev/react';
import {useState, useEffect} from 'react';

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  console.log("Address:", address);

  // initialize the editionDrop contract
  const editionDrop = useEditionDrop("0x81d8950aeA472C1d3c39D11379102542e6194491");
  // State variable to know if the user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

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

  if(!address) {
    return (
      <div className="landing">
        <h1>Bem vindo à XGoHorseDAO - A única opção é a mais rápida!</h1>
        <button onClick={connectWithMetamask}>
          Conecte sua carteira
        </button>
      </div>
    );
  }

  return (
    <div className="landing">
      <h1>Bem-vindo DEVs. Resolveu o problema? Compilou? Commit e era isso.</h1>
    </div>
  )
}

export default App
