// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract StealthSquadSecrets is SepoliaConfig {
    using FHE for *;
    
    struct FantasyTeam {
        euint32 teamId;
        euint32 totalScore;
        euint32 wins;
        euint32 losses;
        euint32 ties;
        bool isActive;
        string teamName;
        address owner;
        uint256 createdAt;
    }
    
    struct Player {
        euint32 playerId;
        euint32 performanceScore;
        euint32 price;
        bool isAvailable;
        string name;
        string position;
        address teamOwner;
    }
    
    struct Trade {
        euint32 tradeId;
        euint32 playerId;
        euint32 proposedPrice;
        bool isAccepted;
        bool isCompleted;
        address fromTeam;
        address toTeam;
        uint256 timestamp;
    }
    
    struct League {
        euint32 leagueId;
        euint32 entryFee;
        euint32 prizePool;
        euint32 maxTeams;
        euint32 currentTeams;
        bool isActive;
        string leagueName;
        address creator;
        uint256 startTime;
        uint256 endTime;
    }
    
    mapping(uint256 => FantasyTeam) public teams;
    mapping(uint256 => Player) public players;
    mapping(uint256 => Trade) public trades;
    mapping(uint256 => League) public leagues;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public teamPerformance;
    
    uint256 public teamCounter;
    uint256 public playerCounter;
    uint256 public tradeCounter;
    uint256 public leagueCounter;
    
    address public owner;
    address public verifier;
    
    event TeamCreated(uint256 indexed teamId, address indexed owner, string teamName);
    event PlayerAdded(uint256 indexed playerId, string name, string position);
    event TradeProposed(uint256 indexed tradeId, uint256 indexed playerId, address indexed fromTeam);
    event TradeAccepted(uint256 indexed tradeId, address indexed toTeam);
    event LeagueCreated(uint256 indexed leagueId, address indexed creator, string leagueName);
    event TeamJoinedLeague(uint256 indexed teamId, uint256 indexed leagueId);
    event ScoreUpdated(uint256 indexed teamId, uint32 newScore);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createTeam(
        string memory _teamName,
        externalEuint32 initialScore,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_teamName).length > 0, "Team name cannot be empty");
        
        uint256 teamId = teamCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalScore = FHE.fromExternal(initialScore, inputProof);
        
        teams[teamId] = FantasyTeam({
            teamId: FHE.asEuint32(0), // Will be set properly later
            totalScore: internalScore,
            wins: FHE.asEuint32(0),
            losses: FHE.asEuint32(0),
            ties: FHE.asEuint32(0),
            isActive: true,
            teamName: _teamName,
            owner: msg.sender,
            createdAt: block.timestamp
        });
        
        emit TeamCreated(teamId, msg.sender, _teamName);
        return teamId;
    }
    
    function addPlayer(
        string memory _name,
        string memory _position,
        externalEuint32 performanceScore,
        externalEuint32 price,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Player name cannot be empty");
        require(bytes(_position).length > 0, "Position cannot be empty");
        
        uint256 playerId = playerCounter++;
        
        // Convert external values to internal FHE values
        euint32 internalScore = FHE.fromExternal(performanceScore, inputProof);
        euint32 internalPrice = FHE.fromExternal(price, inputProof);
        
        players[playerId] = Player({
            playerId: FHE.asEuint32(0), // Will be set properly later
            performanceScore: internalScore,
            price: internalPrice,
            isAvailable: true,
            name: _name,
            position: _position,
            teamOwner: address(0)
        });
        
        emit PlayerAdded(playerId, _name, _position);
        return playerId;
    }
    
    function proposeTrade(
        uint256 playerId,
        uint256 toTeamId,
        externalEuint32 proposedPrice,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(players[playerId].isAvailable, "Player is not available");
        require(teams[toTeamId].owner != address(0), "Target team does not exist");
        require(teams[toTeamId].isActive, "Target team is not active");
        
        uint256 tradeId = tradeCounter++;
        
        // Convert external value to internal FHE value
        euint32 internalPrice = FHE.fromExternal(proposedPrice, inputProof);
        
        trades[tradeId] = Trade({
            tradeId: FHE.asEuint32(0), // Will be set properly later
            playerId: FHE.asEuint32(0), // Will be set to actual value
            proposedPrice: internalPrice,
            isAccepted: false,
            isCompleted: false,
            fromTeam: msg.sender,
            toTeam: teams[toTeamId].owner,
            timestamp: block.timestamp
        });
        
        emit TradeProposed(tradeId, playerId, msg.sender);
        return tradeId;
    }
    
    function acceptTrade(uint256 tradeId) public {
        require(trades[tradeId].toTeam == msg.sender, "Only target team can accept trade");
        require(!trades[tradeId].isCompleted, "Trade already completed");
        
        trades[tradeId].isAccepted = true;
        trades[tradeId].isCompleted = true;
        
        // Update player ownership
        uint256 playerId = 0; // This would be decrypted from trades[tradeId].playerId
        players[playerId].teamOwner = msg.sender;
        players[playerId].isAvailable = false;
        
        emit TradeAccepted(tradeId, msg.sender);
    }
    
    function createLeague(
        string memory _leagueName,
        uint256 _maxTeams,
        uint256 _duration,
        externalEuint32 entryFee,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_leagueName).length > 0, "League name cannot be empty");
        require(_maxTeams > 0, "Max teams must be positive");
        require(_duration > 0, "Duration must be positive");
        
        uint256 leagueId = leagueCounter++;
        
        // Convert external value to internal FHE value
        euint32 internalEntryFee = FHE.fromExternal(entryFee, inputProof);
        
        leagues[leagueId] = League({
            leagueId: FHE.asEuint32(0), // Will be set properly later
            entryFee: internalEntryFee,
            prizePool: FHE.asEuint32(0),
            maxTeams: FHE.asEuint32(0), // Will be set to actual value
            currentTeams: FHE.asEuint32(0),
            isActive: true,
            leagueName: _leagueName,
            creator: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration
        });
        
        emit LeagueCreated(leagueId, msg.sender, _leagueName);
        return leagueId;
    }
    
    function joinLeague(
        uint256 teamId,
        uint256 leagueId,
        externalEuint32 entryFee,
        bytes calldata inputProof
    ) public {
        require(teams[teamId].owner == msg.sender, "Only team owner can join league");
        require(leagues[leagueId].isActive, "League is not active");
        require(block.timestamp <= leagues[leagueId].endTime, "League registration has ended");
        
        // Verify entry fee matches league requirement
        // This would involve FHE comparison operations
        
        // Update league current teams count
        leagues[leagueId].currentTeams = FHE.add(leagues[leagueId].currentTeams, FHE.asEuint32(1));
        
        emit TeamJoinedLeague(teamId, leagueId);
    }
    
    function updateTeamScore(
        uint256 teamId,
        externalEuint32 newScore,
        bytes calldata inputProof
    ) public {
        require(teams[teamId].owner == msg.sender, "Only team owner can update score");
        require(teams[teamId].isActive, "Team is not active");
        
        // Convert external value to internal FHE value
        euint32 internalScore = FHE.fromExternal(newScore, inputProof);
        
        teams[teamId].totalScore = internalScore;
        
        emit ScoreUpdated(teamId, 0); // Score will be decrypted off-chain
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        
        emit ReputationUpdated(user, 0); // Reputation will be decrypted off-chain
    }
    
    function getTeamInfo(uint256 teamId) public view returns (
        string memory teamName,
        uint8 totalScore,
        uint8 wins,
        uint8 losses,
        uint8 ties,
        bool isActive,
        address owner,
        uint256 createdAt
    ) {
        FantasyTeam storage team = teams[teamId];
        return (
            team.teamName,
            0, // FHE.decrypt(team.totalScore) - will be decrypted off-chain
            0, // FHE.decrypt(team.wins) - will be decrypted off-chain
            0, // FHE.decrypt(team.losses) - will be decrypted off-chain
            0, // FHE.decrypt(team.ties) - will be decrypted off-chain
            team.isActive,
            team.owner,
            team.createdAt
        );
    }
    
    function getPlayerInfo(uint256 playerId) public view returns (
        string memory name,
        string memory position,
        uint8 performanceScore,
        uint8 price,
        bool isAvailable,
        address teamOwner
    ) {
        Player storage player = players[playerId];
        return (
            player.name,
            player.position,
            0, // FHE.decrypt(player.performanceScore) - will be decrypted off-chain
            0, // FHE.decrypt(player.price) - will be decrypted off-chain
            player.isAvailable,
            player.teamOwner
        );
    }
    
    function getLeagueInfo(uint256 leagueId) public view returns (
        string memory leagueName,
        uint8 entryFee,
        uint8 prizePool,
        uint8 maxTeams,
        uint8 currentTeams,
        bool isActive,
        address creator,
        uint256 startTime,
        uint256 endTime
    ) {
        League storage league = leagues[leagueId];
        return (
            league.leagueName,
            0, // FHE.decrypt(league.entryFee) - will be decrypted off-chain
            0, // FHE.decrypt(league.prizePool) - will be decrypted off-chain
            0, // FHE.decrypt(league.maxTeams) - will be decrypted off-chain
            0, // FHE.decrypt(league.currentTeams) - will be decrypted off-chain
            league.isActive,
            league.creator,
            league.startTime,
            league.endTime
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function withdrawPrize(uint256 leagueId) public {
        require(leagues[leagueId].creator == msg.sender, "Only league creator can withdraw");
        require(block.timestamp > leagues[leagueId].endTime, "League must be ended");
        require(leagues[leagueId].isActive, "League must be active");
        
        // Transfer prize pool to winner
        // Note: In a real implementation, prize distribution would be based on decrypted scores
        leagues[leagueId].isActive = false;
        
        // For now, we'll transfer a placeholder amount
        // payable(msg.sender).transfer(prizeAmount);
    }
}
