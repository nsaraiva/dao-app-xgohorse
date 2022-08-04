/* eslint-disable no-useless-concat */
import{useAddress, useMetamask, useEditionDrop, useToken, useVote} from '@thirdweb-dev/react';
import {useState, useEffect, useMemo} from 'react';
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  // Using the hooks thirdweb gives us
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  console.log("Address:", address);

  // initialize the editionDrop contract
  const editionDrop = useEditionDrop("0x81d8950aeA472C1d3c39D11379102542e6194491");
  const token = useToken("0x4Be6f49B03Ca2D9AA5670522bd72c219a53c34E1");
  const vote = useVote("0x98edcaea1e63BC79E117216c0d49cDEaB20b0328");
  // State variable to know if the user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming helps us know if it is in the loading state while the NFT is minted.
  const [isClaiming,setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length-4) 
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Retrieve all existing proposals in the contract
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  // A simple call to vote.getAll() to get the proposals
  const getAllProposals = async () => {
    try {
      const proposals = await vote.getAll();
      setProposals(proposals);
      console.log("📜 Propostas:", proposals);
    } catch (error) {
      console.log("Falha ao buscar propostas", error);
    }
  };
  getAllProposals();
}, [hasClaimedNFT, vote]);

// Check if the user has already voted
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

// If we haven't finished retrieving the useEffect proposals above, 
// then we still can't check if the user voted!
  if (!proposals.length) {
    return;
  }

  const checkIfUserHasVoted = async () => {
    try {
      const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("✅ Usuário já votou");
      } else {
        console.log("😢 Usuário ainda não votou");
      }
    } catch (error) {
      console.error("Falha ao verificar se carteira já votou", error);
    }
  };
  checkIfUserHasVoted();

}, [hasClaimedNFT, proposals, address, vote]);

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
        <h1> 🐴 Página dos membros da XGoHorseDAO</h1>
        <p>Parabéns por fazer parte desse clube de Devs!</p>
        <div>
          <div>
            <h2>🐴 Lista de Membros</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>🏠 Endereço</th>
                  <th>💰 Quantidade de Tokens</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>📜 Propostas Ativas</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()

                // Before doing the async stuff, disable the button to prevent double click
                setIsVoting(true)

                // get the votes in the form
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    // Abstain is the default choice
                    vote: 2,
                  }
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    )

                    if (elem.checked) {
                      voteResult.vote = vote.type
                      return
                    }
                  })
                  return voteResult
                })

                // Make sure the user delegates their tokens for the vote
                try {
                  // Check if wallet needs to delegate tokens before voting
                  const delegation = await token.getDelegationOf(address)
                  // If the delegation is address 0x0 it means they haven't delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    // If they haven't delegated yet, delegate them before voting
                    await token.delegateTo(address)
                  }
                  // Then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // Before voting, find out if the proposal is open for voting. Get the last state of the proposal
                        const proposal = await vote.get(proposalId)
                        // checks if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it's open, then vote for it
                          return vote.vote(proposalId, _vote)
                        }
                        // If the proposal is not open, return empty and continue
                        return
                      })
                    )
                    try {
                      // If any proposal is ready to be executed, we execute it. 
                      // The proposal is ready to be executed if the state is equal to 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // First get the proposal state again, given that we may have just voted
                          const proposal = await vote.get(proposalId)

                          // If the state is equal to 4 (ready to be executed), we execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId)
                          }
                        })
                      )
                      // If we got here, it means you voted successfully, so we set "hasVoted" to true
                      setHasVoted(true)
                      console.log("votado com sucesso")
                    } catch (err) {
                      console.error("falha ao executar votos", err)
                    }
                  } catch (err) {
                    console.error("falha ao votar", err)
                  }
                } catch (err) {
                  console.error("falha ao delegar tokens")
                } finally {
                  // Anyway, set isVoting back to false to enable the button again
                  setIsVoting(false)
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => {
                      const translations = {
                        Against: "Contra",
                        For: "A favor",
                        Abstain: "Abstenção",
                      }
                      return (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId}
                            value={type}
                            //default value "abstain" is enabled
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                            {translations[label]}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Votando..."
                  : hasVoted
                    ? "Você já votou"
                    : "Submeter votos"}
              </button>
              {!hasVoted && (
                <small>
                  Isso irá submeter várias transações que você precisará assinar.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  };

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
