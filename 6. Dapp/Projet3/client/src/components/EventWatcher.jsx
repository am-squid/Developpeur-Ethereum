import { useEffect } from "react";
import { useEth } from "../contexts/EthContext";

function EventWatcher({currentState, refreshVoterList, addToProposalList, changeState}) {
    const { state: { contract, accounts, isOwner } } = useEth();

    // Refresh and store a list of all events
    const refreshEvents = async () => {
        if (contract === null) {
            return;
        }
        // Watching the workflowState
        let status = await contract.getPastEvents('WorkflowStatusChange', { fromBlock: 0, toBlock: 'latest' });
        let mostRecent = status[status.length-1].returnValues.newStatus;
        if (parseInt(mostRecent) > currentState) {
            changeState(parseInt(mostRecent));
        }

        // Component will keep up to date different events for different contract state
        if (currentState === 0) {
            let voterList = [];
            const list = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: 'latest' });
            list.map((voter) => {
                voterList.push(voter.returnValues.voterAddress);
            });
            refreshVoterList(voterList);
        }

        if (currentState === 1) {
            const list = await contract.getPastEvents('ProposalRegistered', { fromBlock: 0, toBlock: 'latest' });
            list.map(async (proposalId, index) => {
                let proposal = await contract.methods.getOneProposal(proposalId.returnValues.proposalId).call({from: accounts[0]});
                addToProposalList({'key':index, 'description': proposal.description, 'voteCount': proposal.voteCount});
            });
        }
    }

    useEffect(() => {
        const refreshTimer = setInterval(refreshEvents, 2000);
        return () => clearInterval(refreshTimer);
    }, [contract, accounts, currentState]);
}

export default EventWatcher;