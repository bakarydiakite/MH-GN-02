// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NaissanceRegistry
 * @notice Registre d'état civil souverain de la République de Guinée — NaissanceChain
 * @dev Ancre les empreintes SHA-256 des actes de naissance sur Polygon Amoy.
 *      Aucune donnée personnelle n'est stockée : uniquement le hash cryptographique.
 */
contract NaissanceRegistry {

    // ─── État du contrat ────────────────────────────────────────────────────
    address public owner;
    address public backendOperator;

    // hash (bytes32) => timestamp d'ancrage (0 = non ancré)
    mapping(bytes32 => uint256) private anchorTimestamps;

    // hash (bytes32) => agent qui a ancré
    mapping(bytes32 => address) private anchorAgents;

    // Compteur total d'actes ancrés
    uint256 public totalAnchored;

    // ─── Événements ─────────────────────────────────────────────────────────
    event RecordAnchored(
        bytes32 indexed recordHash,
        address indexed anchoredBy,
        uint256 timestamp,
        uint256 indexed recordIndex
    );

    event OperatorUpdated(address indexed oldOperator, address indexed newOperator);

    // ─── Modificateurs ──────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "NaissanceRegistry: Not owner");
        _;
    }

    modifier onlyOperator() {
        require(
            msg.sender == owner || msg.sender == backendOperator,
            "NaissanceRegistry: Not authorized operator"
        );
        _;
    }

    // ─── Constructeur ───────────────────────────────────────────────────────
    constructor(address _backendOperator) {
        owner = msg.sender;
        backendOperator = _backendOperator;
    }

    // ─── Fonctions d'écriture ───────────────────────────────────────────────

    /**
     * @notice Ancre l'empreinte d'un acte de naissance sur la blockchain.
     * @dev Seul le backend opérateur autorisé peut appeler cette fonction.
     * @param recordHash Le hash SHA-256 de l'acte (converti en bytes32).
     */
    function anchorRecord(bytes32 recordHash) external onlyOperator {
        require(recordHash != bytes32(0), "NaissanceRegistry: Invalid hash");
        require(
            anchorTimestamps[recordHash] == 0,
            "NaissanceRegistry: Record already anchored"
        );

        anchorTimestamps[recordHash] = block.timestamp;
        anchorAgents[recordHash] = msg.sender;
        totalAnchored++;

        emit RecordAnchored(recordHash, msg.sender, block.timestamp, totalAnchored);
    }

    /**
     * @notice Ancre plusieurs actes en une seule transaction (économie de gas).
     * @param recordHashes Tableau des hashs à ancrer.
     */
    function anchorBatch(bytes32[] calldata recordHashes) external onlyOperator {
        uint256 length = recordHashes.length;
        require(length > 0 && length <= 50, "NaissanceRegistry: Batch size 1-50");

        for (uint256 i = 0; i < length; i++) {
            bytes32 h = recordHashes[i];
            if (h != bytes32(0) && anchorTimestamps[h] == 0) {
                anchorTimestamps[h] = block.timestamp;
                anchorAgents[h] = msg.sender;
                totalAnchored++;
                emit RecordAnchored(h, msg.sender, block.timestamp, totalAnchored);
            }
        }
    }

    // ─── Fonctions de lecture ───────────────────────────────────────────────

    /**
     * @notice Vérifie si un hash a été ancré.
     * @param recordHash Le hash à vérifier.
     * @return true si ancré, false sinon.
     */
    function verifyRecord(bytes32 recordHash) external view returns (bool) {
        return anchorTimestamps[recordHash] != 0;
    }

    /**
     * @notice Retourne le timestamp UNIX d'ancrage d'un hash.
     * @param recordHash Le hash à interroger.
     * @return Timestamp en secondes depuis epoch (0 si non ancré).
     */
    function getAnchorTimestamp(bytes32 recordHash) external view returns (uint256) {
        return anchorTimestamps[recordHash];
    }

    /**
     * @notice Retourne l'adresse de l'opérateur qui a ancré le record.
     * @param recordHash Le hash à interroger.
     */
    function getAnchorAgent(bytes32 recordHash) external view returns (address) {
        return anchorAgents[recordHash];
    }

    /**
     * @notice Retourne les informations complètes d'ancrage.
     * @param recordHash Le hash à interroger.
     * @return anchored True si le hash est ancré, false sinon.
     * @return timestamp Le timestamp UNIX de l'ancrage.
     * @return agent L'adresse de l'opérateur ayant effectué l'ancrage.
     */
    function getAnchorInfo(bytes32 recordHash)
        external
        view
        returns (bool anchored, uint256 timestamp, address agent)
    {
        timestamp = anchorTimestamps[recordHash];
        anchored = timestamp != 0;
        agent = anchorAgents[recordHash];
    }

    // ─── Administration ─────────────────────────────────────────────────────

    /**
     * @notice Met à jour l'adresse du wallet backend opérateur.
     */
    function setBackendOperator(address _newOperator) external onlyOwner {
        require(_newOperator != address(0), "NaissanceRegistry: Zero address");
        emit OperatorUpdated(backendOperator, _newOperator);
        backendOperator = _newOperator;
    }

    /**
     * @notice Transfère la propriété du contrat.
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "NaissanceRegistry: Zero address");
        owner = _newOwner;
    }
}
