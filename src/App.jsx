/* eslint-disable no-useless-concat */
import{useAddress, useMetamask, useEditionDrop, useToken} from '@thirdweb-dev/react';
import {useState, useEffect, useMemo} from 'react';

const App = () => {
  // Using the hooks thirdweb gives us
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  console.log("Address:", address);

  // initialize the editionDrop contract
  const editionDrop = useEditionDrop("0x81d8950aeA472C1d3c39D11379102542e6194491");
  const token = useToken("0x4Be6f49B03Ca2D9AA5670522bd72c219a53c34E1");
  // State variable to know if the user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming helps us know if it is in the loading state while the NFT is minted.
  const [isClaiming,setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length-4) 
  };

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🏠 Endereços de membros", memberAddresses);
      } catch (error) {
        console.error("Falha ao pegar lista de membros", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
      } catch (error) {
          console.error("falha ao buscar o saldo dos membros", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts?.find(({holder}) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

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
      <div className="member-page">
        <h1> Página dos membros da DAO</h1>
        <p>Parabéns por fazer parte desse clube de bikers!</p>
        <div>
          <div>
            <h2>Lista de Membros</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Endereço</th>
                  <th>Quantidade de Tokens</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
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
