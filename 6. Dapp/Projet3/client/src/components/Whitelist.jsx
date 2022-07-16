import { useEffect } from "react";
import { useState } from "react";
import { useEth } from "../contexts/EthContext";

function Whitelist({currentState, voterList, updateVoterList}){
    const [newVoterInput, setNewVoterInput] = useState("");
    const { state: { contract, accounts, isOwner } } = useEth();

    const handleVoterInputChange = e => {
        setNewVoterInput(e.target.value)
    }

    // Adds a voter to the Whitelist    
    const addToWhitelist = async e => {
        await contract.methods.addVoter(newVoterInput).send({from: accounts[0]});
    }

    const updateListOfVoters = async () => {
        let finalList = [];
        if(contract)
        {
            const list = await contract.getPastEvents('VoterRegistered', {fromBlock: 0, toBlock: 'latest'});
            list.map((voter) => {
                finalList.push(voter.returnValues.voterAddress);
            }); 
            updateVoterList(finalList);
        }        
    }

    useEffect(() => {
        // We always get the voter list
        updateListOfVoters();
        // If we are at the registering voters status, we refresh the voter every 2 seconds
        if(currentState === 0)
        {
            const refreshTimer = setInterval(updateListOfVoters, 2000);
            return () => clearInterval(refreshTimer);
        }                
    }, [contract]);

    if ( isOwner && currentState === 0)
    {
        return(
            <div>
                <h1>Whitelist</h1>
    
                <input type='text' placeholder="Ajouter une adresse en tant que voteur" 
                    value={newVoterInput} onChange={handleVoterInputChange} />
                <button onClick={addToWhitelist}>Ajouter à la whitelist</button>
                <button onClick={updateListOfVoters}>Lister les voteurs</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Whitelist</h1>
            <button onClick={updateListOfVoters}>Lister les voteurs</button>
        </div>
    );

    
}

export default Whitelist;