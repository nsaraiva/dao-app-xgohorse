import sdk from "./1-initialize-sdk.js";

// governance contract
const vote = sdk.getVote("0xa97B645160d1CBCE55e521fdED1A7443d0E99d83");

// ERC-20 contract
const token = sdk.getToken("0xf2B80A49943D132D762f5877e48b1FdCa445521D");

(async () => {
  try {
    // Power to mint additional tokens if needed
    await token.roles.grant("minter", vote.getAddress());

    console.log("✅  Módulo de votos recebeu permissão de manipular os tokens com sucesso");
  } catch (error) {
    console.error("Falha ao dar acesso aos tokens ao módulo de votos",error);
    process.exit(1);
  }

  try {
    //Get the token balance from the wallet
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Take 90% of the supply.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    // Transfer 90% of the supply to the voting contract
    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Transferiu " + percent90 + " tokens para o módulo de votos com sucesso");
  } catch (error) {
    console.error("Falha ao transferir tokens ao módulo de votos", error);
  }
})();