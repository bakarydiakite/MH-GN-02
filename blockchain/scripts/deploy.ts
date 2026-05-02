import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("NaissanceChain — Déploiement du Smart Contract NaissanceRegistry");
  console.log("━".repeat(60));

  // Récupérer le signataire (wallet déployeur)
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(`Adresse déployeur : ${deployer.address}`);
  console.log(`Balance MATIC    : ${ethers.formatEther(balance)} MATIC`);
  console.log(`Réseau           : ${(await ethers.provider.getNetwork()).name}`);
  console.log("━".repeat(60));

  if (balance === 0n) {
    console.error("\n Balance nulle ! Obtenez des MATIC de test sur :");
    console.error("   https://faucet.polygon.technology");
    process.exit(1);
  }

  // L'opérateur backend = même wallet que le déployeur pour simplifier
  // En production, vous pouvez utiliser un wallet séparé
  const backendOperator = deployer.address;

  console.log(`\n Déploiement de NaissanceRegistry...`);
  console.log(`   Backend Operator : ${backendOperator}`);

  const NaissanceRegistry = await ethers.getContractFactory("NaissanceRegistry");
  const registry = await NaissanceRegistry.deploy(backendOperator);

  console.log("\n En attente de confirmation...");
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  const deploymentTx = registry.deploymentTransaction();

  console.log("\n✅ Contrat déployé avec succès !");
  console.log("━".repeat(60));
  console.log(` Adresse contrat  : ${contractAddress}`);
  console.log(` Tx Hash          : ${deploymentTx?.hash}`);
  console.log(` Bloc             : ${deploymentTx?.blockNumber ?? "en cours..."}`);
  console.log("\n Ajoutez cette ligne dans votre .env :");
  console.log(`   NAISSANCEREGISTRY_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n Vérifiez la transaction sur :");
  console.log(`   https://amoy.polygonscan.com/address/${contractAddress}`);
  console.log("━".repeat(60));

  // Test rapide : vérifier que le contrat répond
  const totalAnchored = await registry.totalAnchored();
  console.log(`\n✔ Test contrat : totalAnchored = ${totalAnchored} (devrait être 0)`);
  console.log("\n Déploiement terminé avec succès !");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n Échec du déploiement :", error);
    process.exit(1);
  });
