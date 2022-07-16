import { useEffect } from "react";
import { useEth } from "../contexts/EthContext";

function EventWatcher({currentState, refreshVoterList}) {
    const { state: { contract, accounts, isOwner } } = useEth();

    // Refresh and store a list of all events
    const refreshEvents = async () => {
        console.log('refreshing');
        if (contract === null) {
            return;
        }
        // Component will keep up to date different events for different contract state
        if (currentState === 0) {
            let voterList = []
            const list = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: 'latest' });
            list.map((voter) => {
                voterList.push(voter.returnValues.voterAddress);
            });
            refreshVoterList(voterList);
        }        
    }

    useEffect(() => {
        const refreshTimer = setInterval(refreshEvents, 2000);
        return () => clearInterval(refreshTimer);
    }, [contract]);
}

export default EventWatcher;