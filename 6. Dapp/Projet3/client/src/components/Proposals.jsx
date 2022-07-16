import { useState } from "react";
import { useEth } from "../contexts/EthContext";

function Proposals(currentState){
    const [newProposalInput, setNewProposalInput] = useState("");
    const { state: { contract, accounts } } = useEth();

    const handleNewProposalChange = e => {
        setNewProposalInput(e.target.value)
    }

    const registerProposal = async () => {
        await contract.methods.addProposal(newProposalInput).send({from: accounts[0]});
    }

    return(
        <div>
            <h1>Proposals</h1>
            <input type='text' placeholder="Détails de la proposition"
               value={newProposalInput} onChange={handleNewProposalChange}/>
            <button onClick={registerProposal}>Ajouter</button>
        </div>
    )
}

export default Proposals;