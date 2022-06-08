// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @author Yohann Youssouf - promo Ropsten
/// @title Voting contract
contract Voting is Ownable{
    // States of the voting session
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    // Events
    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

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

    uint private winningProposalId;
    // Initialising the voting session with the voters registering
    WorkflowStatus public votingState = WorkflowStatus.RegisteringVoters;
    // Creating the voters whitelist
    mapping(address=>Voter) public voters;
    // Creating the list of Proposals
    Proposal[] public proposals;

    /// @dev modifier that require the user to be whitelisted
    modifier onlyVoter(){
      require(voters[msg.sender].isRegistered, "User is not registered as a voter");
      _;
    }

    // Workflow methods
    /**
      * @notice Change the voting state to ProposalRegistrationStarted: allowing voters to register proposals
      */
    function startProposalRegistration() public onlyOwner{
        require(votingState == WorkflowStatus.RegisteringVoters, "Requested change doesn't comply with voting workflow.");
        votingState = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
      * @notice Change the voting state to ProposalRegistrationEnded: Stops the proposal registration for the voters
      */
    function stopProposalRegistration() public onlyOwner{
        require(votingState == WorkflowStatus.ProposalsRegistrationStarted, "Requested change doesn't comply with voting workflow.");
        votingState = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
      * @notice Change the voting state to VotingSessionStarted: allowing voters to vote for proposals
      */
    function startVotingSession() public onlyOwner{
        require(votingState == WorkflowStatus.ProposalsRegistrationEnded, "Requested change doesn't comply with voting workflow.");
        votingState = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
      * @notice Change the voting state to VotingSessionEnded: disallowing voters to vote for proposals
      */
    function stopVotingSession() public onlyOwner{
        require(votingState == WorkflowStatus.VotingSessionStarted, "Requested change doesn't comply with voting workflow.");
        votingState = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    // Utils
    /**
     * @notice Adds a new voter to the whitelist. Can only be called during the RegisteringVoters period
     */
    function whitelist(address _address) public onlyOwner{
        require(votingState == WorkflowStatus.RegisteringVoters, "Can't register new voters outside of the registration period");
        voters[_address].isRegistered = true;
        voters[_address].hasVoted = false;
        emit VoterRegistered(_address);
    }

    /**
     * @notice Registers a new proposal in the list. Can only be called during the proposal registration period, by registered voters
     * @param _proposalDescription : description of the proposal
     */ 
    function registerProposal(string memory _proposalDescription) public onlyVoter{
        require(votingState == WorkflowStatus.ProposalsRegistrationStarted, "Proposal registration has not started or is already closed");
        proposals.push(Proposal(_proposalDescription, 0));
        // Emitting the id of the last registered proposal
        emit ProposalRegistered(proposals.length - 1);
    }

    /**
     * @notice Vote for a proposal. Can only be called during the voting period, by registered voters that has not already voted
     * @param _proposalId : id of the proposal to vote for
     */
    function vote(uint _proposalId) public onlyVoter{
        require(votingState == WorkflowStatus.VotingSessionStarted, "Voting session has not started or is already over");
        require(!voters[msg.sender].hasVoted, "Voter has already voted for a proposal");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;   
        emit Voted(msg.sender, _proposalId);
    }

    /**
     * @notice Tallies the vote and change the voting session status to "VotesTallied"
     */
    function tallyVotes() public onlyOwner{
        require(votingState == WorkflowStatus.VotingSessionEnded, "The voting session must be closed before tallying votes");

        /// @dev Iterating through the proposal of the current session with a simple highest count compare
        uint hightestVoteCount = 0;
        for(uint proposalId = 0; proposalId < proposals.length; proposalId++){
            if (proposals[proposalId].voteCount > hightestVoteCount){
                winningProposalId = proposalId;
                hightestVoteCount = proposals[proposalId].voteCount;
            }
        }
        // Changing the state to allow user to check the winner details
        votingState = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    /**
     * @notice Returns the winning proposal
     */
    function getWinner() public view returns(Proposal memory){
        require(votingState == WorkflowStatus.VotesTallied, "Waiting for the voting session to end");
        return proposals[winningProposalId];
    }
}