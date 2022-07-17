import { useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function Workflow({currentState}) {
    const { state: { contract, accounts, isOwner } } = useEth();

    const statusList = [
        "Enregistrement des voteurs",
        "Enregistrement des propositions",
        "Fin de l'enregistrement des propositions",
        "Votes ouverts",
        "Votes fermés",
        "Résultats disponibles"
    ]
    

    const nextStatus = async () => {
        switch(currentState){
            case 0:
                await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
                break;
            case 1:
                await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
                break;
            case 2:
                await contract.methods.startVotingSession().send({ from: accounts[0] });
                break;
            case 3:
                await contract.methods.endVotingSession().send({ from: accounts[0] });
                break;
            case 4:
                await contract.methods.tallyVotes().send({ from: accounts[0] });
                break;
            default: break;
        }
    }

    // The button will disappear at the end of the workflow
    let nextButton = (
        <button onClick={nextStatus}>
            Suivant : {statusList[currentState+1]}
        </button>
    );
    if (currentState >= 5)
    {
        nextButton = (<></>);
    }

    // Admin view
    if (isOwner) {
        return (
            <div className="workflowContainer">
                <div>
                    Etape : {statusList[currentState]}
                </div>
                {nextButton}                
            </div>
        );
    }

    return (
        <div className="workflowContainer">
            <div>
                Etape : {statusList[currentState]}
            </div>
        </div>
    );
}

export default Workflow;