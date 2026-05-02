import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as crypto from 'crypto';

// ABI minimal du contrat NaissanceRegistry (fonctions utilisées par le backend)
const NAISSANCEREGISTRY_ABI = [
  // Écriture
  'function anchorRecord(bytes32 recordHash) external',
  'function anchorBatch(bytes32[] calldata recordHashes) external',
  // Lecture
  'function verifyRecord(bytes32 recordHash) external view returns (bool)',
  'function getAnchorTimestamp(bytes32 recordHash) external view returns (uint256)',
  'function getAnchorInfo(bytes32 recordHash) external view returns (bool anchored, uint256 timestamp, address agent)',
  'function totalAnchored() external view returns (uint256)',
  // Events
  'event RecordAnchored(bytes32 indexed recordHash, address indexed anchoredBy, uint256 timestamp, uint256 indexed recordIndex)',
];

export interface AnchorResult {
  txHash: string;
  blockNumber: number;
  timestamp: Date;
  network: string;
  gasUsed?: string;
  mode: 'live' | 'mock';
}

export interface VerifyResult {
  verified: boolean;
  anchorTimestamp?: Date;
  anchorAgent?: string;
  mode: 'live' | 'mock';
}

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly mode: 'live' | 'mock';

  // Connexion Polygon Amoy
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;

  constructor(private readonly config: ConfigService) {
    this.mode = (this.config.get<string>('BLOCKCHAIN_MODE', 'mock') as 'live' | 'mock');
  }

  async onModuleInit() {
    if (this.mode === 'live') {
      await this.initializeBlockchainConnection();
    } else {
      this.logger.warn('⚠️  Mode MOCK activé — aucune vraie transaction blockchain ne sera émise.');
      this.logger.warn('   Pour activer : BLOCKCHAIN_MODE=live dans .env');
    }
  }

  // ─── Initialisation de la connexion ───────────────────────────────────────

  private async initializeBlockchainConnection(): Promise<void> {
    try {
      const rpcUrl = this.config.get<string>('POLYGON_AMOY_RPC_URL', 'https://rpc-amoy.polygon.technology');
      const privateKey = this.config.get<string>('BLOCKCHAIN_PRIVATE_KEY');
      const contractAddress = this.config.get<string>('NAISSANCEREGISTRY_CONTRACT_ADDRESS');

      if (!privateKey) {
        this.logger.error('❌ BLOCKCHAIN_PRIVATE_KEY manquante dans .env');
        throw new Error('BLOCKCHAIN_PRIVATE_KEY is required when BLOCKCHAIN_MODE=live');
      }

      if (!contractAddress) {
        this.logger.error('❌ NAISSANCEREGISTRY_CONTRACT_ADDRESS manquante dans .env');
        throw new Error('NAISSANCEREGISTRY_CONTRACT_ADDRESS is required when BLOCKCHAIN_MODE=live');
      }

      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, NAISSANCEREGISTRY_ABI, this.wallet);

      // Vérification de la connexion
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.wallet.address);

      this.logger.log('✅ Connexion Polygon Amoy établie');
      this.logger.log(`   Réseau     : ${network.name} (chainId: ${network.chainId})`);
      this.logger.log(`   Wallet     : ${this.wallet.address}`);
      this.logger.log(`   Balance    : ${ethers.formatEther(balance)} MATIC`);
      this.logger.log(`   Contrat    : ${contractAddress}`);

      if (balance === 0n) {
        this.logger.warn('⚠️  Balance MATIC nulle ! Obtenez des MATIC de test :');
        this.logger.warn('   https://faucet.polygon.technology');
      }
    } catch (error) {
      this.logger.error('❌ Échec de la connexion blockchain :', error);
      throw error;
    }
  }

  // ─── Génération du Hash ────────────────────────────────────────────────────

  /**
   * Génère le hash SHA-256 des données pivots d'un acte de naissance.
   * SEULES ces données sont hashées — jamais stockées on-chain.
   */
  generateHash(data: {
    identifiantUniqueNational: string;
    nomEnfant: string;
    prenomEnfant: string;
    dateNaissance: string;
    sexe: string;
    lieuNaissance: string;
  }): string {
    // Tri des clés pour garantir le déterminisme
    const ordered = {
      dateNaissance: data.dateNaissance,
      identifiantUniqueNational: data.identifiantUniqueNational,
      lieuNaissance: data.lieuNaissance,
      nomEnfant: data.nomEnfant.toUpperCase().trim(),
      prenomEnfant: data.prenomEnfant.trim(),
      sexe: data.sexe,
    };
    const content = JSON.stringify(ordered);
    return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
  }

  // ─── Ancrage du Hash ───────────────────────────────────────────────────────

  /**
   * Ancre un hash sur la blockchain Polygon Amoy.
   * En mode mock, simule la transaction sans appel réseau.
   */
  async anchorHash(hexHash: string): Promise<AnchorResult> {
    this.logger.log(`📌 Ancrage du hash : ${hexHash.slice(0, 20)}...`);

    if (this.mode === 'mock') {
      return this.mockAnchor(hexHash);
    }

    return this.liveAnchor(hexHash);
  }

  /**
   * Ancre plusieurs hashs en une seule transaction (batch).
   */
  async anchorBatch(hexHashes: string[]): Promise<AnchorResult> {
    this.logger.log(`📌 Ancrage batch de ${hexHashes.length} hash(es)`);

    if (this.mode === 'mock') {
      // Pour le mock, ancre le premier
      return this.mockAnchor(hexHashes[0]);
    }

    if (!this.contract || !this.provider) {
      throw new Error('Blockchain not initialized');
    }

    // Convertit les hex strings en bytes32
    const bytes32Hashes = hexHashes.map(h => this.hexToBytes32(h));

    const tx = await this.contract.anchorBatch(bytes32Hashes);
    this.logger.log(`⏳ Transaction batch envoyée : ${tx.hash}`);

    const receipt = await tx.wait(1); // Attendre 1 confirmation

    this.logger.log(`✅ Batch ancré ! Bloc: ${receipt.blockNumber}`);

    const block = await this.provider.getBlock(receipt.blockNumber);

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date((block?.timestamp ?? Date.now() / 1000) * 1000),
      network: 'polygon-amoy',
      gasUsed: receipt.gasUsed.toString(),
      mode: 'live',
    };
  }

  // ─── Vérification ─────────────────────────────────────────────────────────

  /**
   * Vérifie si un hash est ancré on-chain.
   */
  async verifyHash(hexHash: string): Promise<VerifyResult> {
    this.logger.log(`🔍 Vérification du hash : ${hexHash.slice(0, 20)}...`);

    if (this.mode === 'mock') {
      return {
        verified: true,
        anchorTimestamp: new Date(),
        anchorAgent: '0x_mock_agent',
        mode: 'mock',
      };
    }

    if (!this.contract) {
      throw new Error('Blockchain not initialized');
    }

    const bytes32Hash = this.hexToBytes32(hexHash);
    const [anchored, timestamp, agent] = await this.contract.getAnchorInfo(bytes32Hash);

    return {
      verified: anchored,
      anchorTimestamp: anchored ? new Date(Number(timestamp) * 1000) : undefined,
      anchorAgent: anchored ? agent : undefined,
      mode: 'live',
    };
  }

  /**
   * Récupère les détails d'une transaction par son hash.
   */
  async getTransactionDetails(txHash: string): Promise<{
    blockNumber: number;
    timestamp: Date;
    confirmations: number;
    explorerUrl: string;
  } | null> {
    if (this.mode === 'mock' || !this.provider) {
      return {
        blockNumber: 99999,
        timestamp: new Date(),
        confirmations: 12,
        explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`,
      };
    }

    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) return null;

      const block = await this.provider.getBlock(receipt.blockNumber);
      const currentBlock = await this.provider.getBlockNumber();

      return {
        blockNumber: receipt.blockNumber,
        timestamp: new Date((block?.timestamp ?? 0) * 1000),
        confirmations: currentBlock - receipt.blockNumber,
        explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`,
      };
    } catch {
      return null;
    }
  }

  /**
   * Retourne le nombre total d'actes ancrés.
   */
  async getTotalAnchored(): Promise<number> {
    if (this.mode === 'mock' || !this.contract) {
      return 1247; // Valeur simulée
    }

    const total = await this.contract.totalAnchored();
    return Number(total);
  }

  // ─── Helpers privés ────────────────────────────────────────────────────────

  private async liveAnchor(hexHash: string): Promise<AnchorResult> {
    if (!this.contract || !this.provider) {
      throw new Error('Blockchain not initialized. Check BLOCKCHAIN_MODE and env vars.');
    }

    const bytes32Hash = this.hexToBytes32(hexHash);

    // Vérifier si déjà ancré (idempotence)
    const alreadyAnchored = await this.contract.verifyRecord(bytes32Hash);
    if (alreadyAnchored) {
      this.logger.warn(`⚠️  Hash déjà ancré : ${hexHash.slice(0, 20)}...`);
      const ts = await this.contract.getAnchorTimestamp(bytes32Hash);
      return {
        txHash: `already_anchored_${hexHash.slice(0, 16)}`,
        blockNumber: 0,
        timestamp: new Date(Number(ts) * 1000),
        network: 'polygon-amoy',
        mode: 'live',
      };
    }

    // Envoi de la transaction
    const tx = await this.contract.anchorRecord(bytes32Hash);
    this.logger.log(`⏳ Transaction envoyée : ${tx.hash}`);

    // Attendre 1 confirmation
    const receipt = await tx.wait(1);
    this.logger.log(`✅ Hash ancré ! Bloc: ${receipt.blockNumber}, Gas: ${receipt.gasUsed}`);

    const block = await this.provider.getBlock(receipt.blockNumber);

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date((block?.timestamp ?? Date.now() / 1000) * 1000),
      network: 'polygon-amoy',
      gasUsed: receipt.gasUsed.toString(),
      mode: 'live',
    };
  }

  private async mockAnchor(hexHash: string): Promise<AnchorResult> {
    this.logger.log(`[MOCK] Simulation ancrage hash : ${hexHash.slice(0, 20)}...`);
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
      blockNumber: Math.floor(Math.random() * 9000000) + 50000000,
      timestamp: new Date(),
      network: 'polygon-amoy-mock',
      gasUsed: '52000',
      mode: 'mock',
    };
  }

  /**
   * Convertit un hex string (sha256) en bytes32 pour le contrat Solidity.
   */
  private hexToBytes32(hexHash: string): string {
    const clean = hexHash.startsWith('0x') ? hexHash : `0x${hexHash}`;
    // Padder à 32 bytes si nécessaire
    return ethers.zeroPadValue(clean, 32);
  }

  get isLive(): boolean {
    return this.mode === 'live';
  }
}
