import { useState } from "react";
import { useEth } from "../contexts/EthContext";

function Whitelist({ currentState, voters, updateVoterList }) {
    const [newVoterInput, setNewVoterInput] = useState("");
    const { state: { contract, accounts, isOwner } } = useEth();

    const handleVoterInputChange = e => {
        setNewVoterInput(e.target.value)
    }

    // Adds a voter to the Whitelist    
    const addToWhitelist = async e => {
        await contract.methods.addVoter(newVoterInput).send({ from: accounts[0] });
    }

    let voterBoard = (
        <div className="voterList">
            <table>
                <tbody>
                    {
                        voters.map((voter, index) => {
                            return (<tr><td>{voter}</td></tr>);
                        })
                    }
                </tbody>
            </table>
        </div>
    );

    let adminInput = (
        <div>
            <input type='text' placeholder="Ajouter une adresse en tant que voteur"
                value={newVoterInput} onChange={handleVoterInputChange} />
            <button onClick={addToWhitelist}>Ajouter à la whitelist</button>
        </div>
    )

    if (isOwner && currentState === 0) {
        return (
            <div className="whitelistContainer">
                {voterBoard}
                {adminInput}
            </div>
        );
    }

    return (
        <div className="whitelistContainer">
            {voterBoard}
        </div>
    );


}

export default Whitelist;