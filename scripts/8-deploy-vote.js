import  sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            // Name of the governance agreement
            name: "XGoHorseDAO - A DAO do desenvolvedor XGH",
            // Location of governance token, ERC-20 contract!
            voting_token_address: "0x4Be6f49B03Ca2D9AA5670522bd72c219a53c34E1",
            // After the proposal is created, members can start voting immediately
            voting_delay_in_blocks: 0,
            // Time that members can vote on the proposal when it is created. 1 day (6570 blocks)
            voting_period_in_blocks: 6570,
            // The minimum % of the total offer that needs to vote for the proposal to be valid
            voting_quorum_fraction: 0,
            // # minimum tokens a user needs to be able to create a proposal. No token is needed to create a proposal.
            proposal_token_threshold: 0,            
        });
        console.log("✅ Módulo de votos implantado com sucesso no endereço:", voteContractAddress,);
        } catch (error) {
          console.error("Falha ao implantar o módulo de votos", error);
        }
})();