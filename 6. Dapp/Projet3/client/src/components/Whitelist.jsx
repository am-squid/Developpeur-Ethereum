import { useEffect } from "react";
import { useState } from "react";
import { useEth } from "../contexts/EthContext";

function Whitelist(){
    const [newVoterInput, setNewVoterInput] = useState("");
    const [voterList, setVoterList] = useState([]);
    const { state: { contract, accounts, isOwner } } = useEth();

    const handleVoterInputChange = e => {
        setNewVoterInput(e.target.value)
    }

    // Adds a voter to the Whitelist    
    const addToWhitelist = async e => {
        await contract.methods.addVoter(newVoterInput).send({from: accounts[0]});
    }

    const getListOfVoters = async () => {
        console.log(await contract.getPastEvents('VoterRegistered', {fromBlock: 0, toBlock: 'latest'}));
        
    }

    if ( isOwner )
    {
        return(
            <div>
                <h1>Whitelist</h1>
    
                <input type='text' placeholder="Ajouter une adresse en tant que voteur" 
                    value={newVoterInput} onChange={handleVoterInputChange} />
                <button onClick={addToWhitelist}>Ajouter à la whitelist</button>
                <button onClick={getListOfVoters}>Lister les voteurs</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Whitelist</h1>
            <button onClick={getListOfVoters}>Lister les voteurs</button>
        </div>
    );

    
}

export default Whitelist;