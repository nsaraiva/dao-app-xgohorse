import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xf2B80A49943D132D762f5877e48b1FdCa445521D");

(async () => {
  try {
    // Show current roles
    const allRoles = await token.roles.getAll();

    console.log("👀 Papeis que existem agora:", allRoles);

    // Remove all superpowers my wallet had over the ERC-20 contract
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Papeis depois de remover nós mesmos",
      await token.roles.getAll()
    );
    console.log("✅ Revogados nossos super-poderes sobre os tokens ERC-20");

  } catch (error) {
    console.error("Falha ao remover nossos direitos sobre o tesouro da DAO", error);
  }
})();