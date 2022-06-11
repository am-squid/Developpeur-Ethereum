// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @author Yohann Youssouf - promo Ropsten
/// @title Voting contract
contract Voting is Ownable{
    // Variables 

    // States of the voting session
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    // Structs
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }
    struct SessionDetails {
        string name;
        string description;
        uint sessionId;
    }
    struct Session {
        SessionDetails info;
        mapping(address=>Voter) voters;
        Proposal[] proposals;
        uint winningProposalId;
        WorkflowStatus sessionState;
    }
    uint public sessionNumber;
    mapping(uint => Session) sessions;

    // Events

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    // Constructor

    /**
     * @notice constructor - create the first voting session 
     * @param _name name of the first session
     * @param _description description of the first session
     */ 
    constructor(string memory _name, string memory _description) {
        Session storage s = sessions[sessionNumber];
        s.info = SessionDetails(_name, _description, sessionNumber);
        s.sessionState = WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringVoters);
    }

    // Modifiers

    /// @dev modifier that require the user to be whitelisted
    modifier onlyVoter(){
        Session storage s = sessions[sessionNumber];
        require(s.voters[msg.sender].isRegistered, "User is not registered as a voter");
        _;
    }

    /// @dev modifier that require the current session state to be a given state
    modifier requireState(WorkflowStatus _state){
        Session storage s = sessions[sessionNumber];
        require(s.sessionState == _state, "Requested action does not comply with the session workflow");
        _;
    }

    /// @dev modifier checking if the session id exists
    modifier requireExistingSession(uint _sessionId){
        require(_sessionId >= 0 && _sessionId <= sessionNumber, "Session Id does not exist");
        _;
    }

    /// @dev modifier checking if the proposal id exists
    modifier requireExistingProposal(uint _proposalId){
        Session storage s = sessions[sessionNumber];
        require(_proposalId >= 0 && _proposalId < s.proposals.length, "Proposal Id does not exist");
        _;
    }

    // Functions

    /**
     * @notice Creates a new voting session - onlyAdmin
     * @param _name name of the new voting session
     * @param _description description of the new voting session
     * @return newSessionId id of the new session
     */ 
    function createSession(string calldata _name, string calldata _description) public onlyOwner returns(uint newSessionId){
        newSessionId = ++sessionNumber;
        Session storage s = sessions[newSessionId];
        s.info = SessionDetails(_name, _description, newSessionId);
        s.sessionState = WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange(sessions[newSessionId -1].sessionState, WorkflowStatus.RegisteringVoters);
    }

    /**
     * @notice Returns the details of a given session
     * @param _sessionId id of the session
     * @return info of the current session
     */
    function getSessionDetails(uint _sessionId) public view requireExistingSession(_sessionId) returns(SessionDetails memory){
        Session storage s = sessions[_sessionId];
        return s.info;
    }

    /**
     * @notice Adds a new voter to the whitelist. Can only be called during the RegisteringVoters period
     */
    function whitelist(address _address) public onlyOwner requireState(WorkflowStatus.RegisteringVoters){
        Session storage s = sessions[sessionNumber];
        s.voters[_address].isRegistered = true;
        s.voters[_address].hasVoted = false;
        emit VoterRegistered(_address);
    }

    /**
     * @notice Returns details on a given voter in the current session
     * @param _address Address of the voter
     * @return Voter Details of the voter
     */
    function getVoter(address _address) public view returns(Voter memory) {
        Session storage s = sessions[sessionNumber];
        return s.voters[_address];
    }

    /**
      * @notice Change the voting state to ProposalRegistrationStarted: allowing voters to register proposals
      */
    function startProposalRegistration() public onlyOwner requireState(WorkflowStatus.RegisteringVoters){
        Session storage s = sessions[sessionNumber];
        s.sessionState = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
     * @notice Registers a new proposal in the list. Can only be called during the proposal registration period, by registered voters
     * @param _proposalDescription description of the proposal
     */ 
    function registerProposal(string calldata _proposalDescription) public onlyVoter requireState(WorkflowStatus.ProposalsRegistrationStarted){
        Session storage s = sessions[sessionNumber];
        s.proposals.push(Proposal(_proposalDescription, 0));
        // Emitting the id of the last registered proposal
        emit ProposalRegistered(s.proposals.length - 1);
    }

    /**
     * @notice Get the number of proposal registered in the current session
     * @return uint Number of proposals
     */
    function getNumberOfProposals() public view returns(uint){
        Session storage s = sessions[sessionNumber];
        return s.proposals.length;
    }

    /**
     * @notice Get details for a given proposal in the current session
     * @param _proposalId id of the proposal
     * @return Proposal details of the proposal
     */
    function getProposal(uint _proposalId) public view requireExistingProposal(_proposalId) returns(Proposal memory){
        Session storage s = sessions[sessionNumber];
        return s.proposals[_proposalId];
    }

    /**
      * @notice Change the voting state to ProposalRegistrationEnded: Stops the proposal registration for the voters
      */
    function stopProposalRegistration() public onlyOwner requireState(WorkflowStatus.ProposalsRegistrationStarted){
        Session storage s = sessions[sessionNumber];
        s.sessionState = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
      * @notice Change the voting state to VotingSessionStarted: allowing voters to vote for proposals
      */
    function startVotingSession() public onlyOwner requireState(WorkflowStatus.ProposalsRegistrationEnded){
        Session storage s = sessions[sessionNumber];
        s.sessionState = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
     * @notice Vote for a proposal. Can only be called during the voting period, by registered voters that has not already voted
     * @param _proposalId id of the proposal to vote for
     */
    function vote(uint _proposalId) public onlyVoter requireState(WorkflowStatus.VotingSessionStarted) requireExistingProposal(_proposalId) {
        Session storage s = sessions[sessionNumber];
        require(!s.voters[msg.sender].hasVoted, "Voter has already voted for a proposal");
        s.voters[msg.sender].hasVoted = true;
        s.voters[msg.sender].votedProposalId = _proposalId;
        s.proposals[_proposalId].voteCount++;   
        emit Voted(msg.sender, _proposalId);
    }

    /**
      * @notice Change the voting state to VotingSessionEnded: disallowing voters to vote for proposals
      */
    function stopVotingSession() public onlyOwner requireState(WorkflowStatus.VotingSessionStarted){
        Session storage s = sessions[sessionNumber];
        s.sessionState = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     * @notice Tallies the vote and change the voting session status to "VotesTallied"
     */
    function tallyVotes() public onlyOwner requireState(WorkflowStatus.VotingSessionEnded){
        Session storage s = sessions[sessionNumber];
        /// @dev Iterating through the proposal of the current session with a simple highest count compare
        uint hightestVoteCount;
        uint winningProposalId;
        for(uint proposalId; proposalId < s.proposals.length; proposalId++){
            if (s.proposals[proposalId].voteCount > hightestVoteCount){
                winningProposalId = proposalId;
                hightestVoteCount = s.proposals[proposalId].voteCount;
            }
        }
        s.winningProposalId = winningProposalId;
        // Changing the state to allow user to check the winner details
        s.sessionState = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    /**
     * @notice Returns the winning proposal of the current session
     * @return Proposal winning proposal
     */
    function getWinner() public view requireState(WorkflowStatus.VotesTallied) returns(Proposal memory){
        Session storage s = sessions[sessionNumber];
        return s.proposals[s.winningProposalId];
    }

    /**
     * @notice Returns the winning proposal of any given session
     * @param _sessionId session number
     */
     function getWinnerOfSession(uint _sessionId) public view requireExistingSession(_sessionId) returns(Proposal memory){
        Session storage s = sessions[_sessionId];
        require(s.sessionState == WorkflowStatus.VotesTallied, "Requested action does not comply with the session workflow");
        return s.proposals[s.winningProposalId];
     }
}