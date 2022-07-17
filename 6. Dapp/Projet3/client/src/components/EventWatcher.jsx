import { useState } from "react";
import { useEffect } from "react";
import { useEth } from "../contexts/EthContext";

function EventWatcher({currentState, changeState, addVoter, addToProposalList}) {
    const { state: { contract, accounts, isOwner } } = useEth();
    const [isInit, setIsInit] = useState(true);

    // Refresh and store a list of all events at application's startup
    const refreshEvents = async () => {
        // Watching the workflowState
        let status = await contract.getPastEvents('WorkflowStatusChange', { fromBlock: 0, toBlock: 'latest' });
        let mostRecent = status[status.length-1].returnValues.newStatus;
        if (parseInt(mostRecent) > currentState) {
            changeState(parseInt(mostRecent));
        }

        const listVoter = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: 'latest' });
        listVoter.map((voter) => {
            addVoter(voter.returnValues.voterAddress);
        });

        const listProposal = await contract.getPastEvents('ProposalRegistered', { fromBlock: 0, toBlock: 'latest' });
        listProposal.map(async (proposalId) => {
            addProposal(proposalId);
        });
    }

    const addProposal = async (proposalId) => {
        let proposal = await contract.methods.getOneProposal(proposalId.returnValues.proposalId).call({from: accounts[0]});
        addToProposalList({'id':proposalId.returnValues.proposalId, 'description': proposal.description, 'voteCount': proposal.voteCount});
    }

    useEffect(() => {
        if(contract === null)
        {
            return;
        }
        // Initialisation de l'event watcher
        if(isInit) {
            setIsInit(false);

            refreshEvents();

            contract.events.WorkflowStatusChange()
            .on('connected', (subscriptionId) => {
                console.log('WorkflowStatusChange connected');
            })
            .on('data', (event) => {
                changeState(event.returnValues.newStatus);
            })
    
            contract.events.VoterRegistered()
            .on('connected', (subscriptionId) => {
                console.log('VoterRegistered connected');
            })
            .on('data', (event) => {
                addVoter(event.returnValues.voterAddress);
            })
    
            contract.events.ProposalRegistered()
            .on('connected', (subscriptionId) => {
                console.log('ProposalRegistered connected');
            })
            .on('data', async (event) => {
                addProposal(event)
            })
            
        }

    }, [contract, accounts, currentState]);
}

export default EventWatcher;