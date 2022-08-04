import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x4Be6f49B03Ca2D9AA5670522bd72c219a53c34E1");

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