import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BlockchainTxStatus } from '@prisma/client';

// ─── DTOs ──────────────────────────────────────────────────────────────────

export class AnchorRequestDto {
  naissanceId!: string;
}

export class VerifyHashDto {
  hash!: string;
}

// ─── Controller ────────────────────────────────────────────────────────────

@Controller('blockchain')
export class BlockchainController {
  private readonly logger = new Logger(BlockchainController.name);

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * POST /blockchain/anchor
   * Ancre l'empreinte d'un acte de naissance sur Polygon Amoy.
   * Appelé automatiquement après validation d'un dossier.
   */
  @Post('anchor')
  @HttpCode(HttpStatus.OK)
  async anchorBirthRecord(@Body() dto: AnchorRequestDto) {
    this.logger.log(`📌 Demande d'ancrage pour naissance: ${dto.naissanceId}`);

    // Récupérer le dossier de naissance avec l'enfant
    const naissance = await this.prisma.birthRecord.findUnique({
      where: { id: dto.naissanceId },
      include: { enfant: true, blockchainTx: true },
    });

    if (!naissance) {
      throw new NotFoundException(`Dossier de naissance introuvable : ${dto.naissanceId}`);
    }

    if (!naissance.enfant) {
      throw new BadRequestException('Données enfant incomplètes — impossible de générer le hash');
    }

    // Vérifier si déjà ancré
    if (naissance.blockchainTx?.statut === BlockchainTxStatus.CONFIRMEE) {
      return {
        success: true,
        message: 'Dossier déjà ancré sur la blockchain',
        txHash: naissance.blockchainTx.txHash,
        blockNumber: naissance.blockchainTx.blocNumero?.toString(),
        status: 'CONFIRMEE',
        explorerUrl: `https://amoy.polygonscan.com/tx/${naissance.blockchainTx.txHash}`,
      };
    }

    // Générer le hash des données pivots
    const hash = this.blockchainService.generateHash({
      identifiantUniqueNational: naissance.identifiantUniqueNational ?? dto.naissanceId,
      nomEnfant: naissance.enfant.nom,
      prenomEnfant: naissance.enfant.prenoms,
      dateNaissance: naissance.enfant.dateNaissance.toISOString().split('T')[0],
      sexe: naissance.enfant.sexe,
      lieuNaissance: naissance.enfant.lieuNaissanceLibelle ?? 'Guinée',
    });

    this.logger.log(`   Hash généré : ${hash.slice(0, 20)}...`);

    // Créer ou mettre à jour l'entrée blockchain EN_ATTENTE
    await this.prisma.blockchainTransaction.upsert({
      where: { naissanceId: dto.naissanceId },
      create: {
        naissanceId: dto.naissanceId,
        statut: BlockchainTxStatus.EN_ATTENTE,
        reseauBlockchain: 'polygon-amoy',
      },
      update: {
        statut: BlockchainTxStatus.EN_ATTENTE,
      },
    });

    // Mettre à jour le hash dans BirthRecord
    await this.prisma.birthRecord.update({
      where: { id: dto.naissanceId },
      data: { hashBlockchain: hash },
    });

    try {
      // ── Ancrage blockchain ───────────────────────────────────────────
      const result = await this.blockchainService.anchorHash(hash);

      // Confirmer la transaction dans la DB
      await this.prisma.blockchainTransaction.update({
        where: { naissanceId: dto.naissanceId },
        data: {
          txHash: result.txHash,
          statut: BlockchainTxStatus.CONFIRMEE,
          blocNumero: BigInt(result.blockNumber),
          horodatageAncrage: result.timestamp,
          reseauBlockchain: result.network,
        },
      });

      this.logger.log(`✅ Ancrage confirmé : ${result.txHash}`);

      return {
        success: true,
        message: 'Acte de naissance ancré sur la blockchain Polygon Amoy',
        hash,
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        timestamp: result.timestamp,
        network: result.network,
        gasUsed: result.gasUsed,
        mode: result.mode,
        explorerUrl: result.mode === 'live'
          ? `https://amoy.polygonscan.com/tx/${result.txHash}`
          : null,
      };
    } catch (error) {
      // Marquer la transaction comme échouée
      await this.prisma.blockchainTransaction.update({
        where: { naissanceId: dto.naissanceId },
        data: { statut: BlockchainTxStatus.ECHEC },
      });

      this.logger.error(`❌ Échec de l'ancrage :`, error);
      throw error;
    }
  }

  /**
   * GET /blockchain/verify/:hash
   * Vérifie si un hash SHA-256 est ancré sur Polygon Amoy.
   * Utilisé par le VerificationScreen de l'app mobile.
   */
  @Get('verify/:hash')
  async verifyHash(@Param('hash') hash: string) {
    if (!hash || hash.length !== 64) {
      throw new BadRequestException('Hash SHA-256 invalide (doit être 64 caractères hexadécimaux)');
    }

    const result = await this.blockchainService.verifyHash(hash);

    return {
      hash,
      verified: result.verified,
      anchorTimestamp: result.anchorTimestamp,
      anchorAgent: result.anchorAgent,
      mode: result.mode,
      message: result.verified
        ? '✅ Document authentique — Hash confirmé sur la blockchain'
        : '⚠️ Hash non trouvé sur la blockchain',
    };
  }

  /**
   * GET /blockchain/status/:naissanceId
   * Retourne le statut blockchain d'un dossier de naissance.
   */
  @Get('status/:naissanceId')
  async getBlockchainStatus(@Param('naissanceId') naissanceId: string) {
    const txRecord = await this.prisma.blockchainTransaction.findUnique({
      where: { naissanceId },
    });

    if (!txRecord) {
      return {
        naissanceId,
        status: 'NON_ANCRE',
        message: 'Ce dossier n\'a pas encore été ancré sur la blockchain',
      };
    }

    let txDetails = null;
    if (txRecord.txHash && txRecord.statut === BlockchainTxStatus.CONFIRMEE) {
      txDetails = await this.blockchainService.getTransactionDetails(txRecord.txHash);
    }

    return {
      naissanceId,
      status: txRecord.statut,
      txHash: txRecord.txHash,
      blockNumber: txRecord.blocNumero?.toString(),
      anchorTimestamp: txRecord.horodatageAncrage,
      network: txRecord.reseauBlockchain,
      confirmations: txDetails?.confirmations,
      explorerUrl: txRecord.txHash
        ? `https://amoy.polygonscan.com/tx/${txRecord.txHash}`
        : null,
    };
  }

  /**
   * GET /blockchain/stats
   * Statistiques globales de la blockchain.
   */
  @Get('stats')
  async getBlockchainStats() {
    const [totalAnchored, pendingCount, failedCount] = await Promise.all([
      this.blockchainService.getTotalAnchored(),
      this.prisma.blockchainTransaction.count({ where: { statut: BlockchainTxStatus.EN_ATTENTE } }),
      this.prisma.blockchainTransaction.count({ where: { statut: BlockchainTxStatus.ECHEC } }),
    ]);

    return {
      network: 'Polygon Amoy',
      chainId: 80002,
      totalAnchored,
      pendingTransactions: pendingCount,
      failedTransactions: failedCount,
      mode: this.blockchainService.isLive ? 'live' : 'mock',
      explorer: 'https://amoy.polygonscan.com',
    };
  }
}
