import { useState } from "react";
import { useEth } from "../contexts/EthContext";

function Proposals({currentState, proposals}) {
    const [newProposalInput, setNewProposalInput] = useState("");
    const { state: { contract, accounts } } = useEth();

    const handleNewProposalChange = e => {
        setNewProposalInput(e.target.value)
    }

    const registerProposal = async () => {
        await contract.methods.addProposal(newProposalInput).send({ from: accounts[0] });
    }

    let proposalBoard = (
        <table>
            <tbody>
                {
                    proposals.map((proposal, index) => {
                        return (<tr><td>{proposal}</td></tr>);
                    })
                }
            </tbody>
        </table>
    );

    return (
        <div className="proposalContainer">

            <input type='text' placeholder="Détails de la proposition"
                value={newProposalInput} onChange={handleNewProposalChange} />
            <button onClick={registerProposal}>Ajouter</button>
        </div>
    )
}

export default Proposals;