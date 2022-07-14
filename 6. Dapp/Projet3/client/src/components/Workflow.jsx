import { useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function Workflow({currentState, changeState}) {
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
        await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
    }

    // The button will disappear at the end of the workflow
    let nextButton = (
        <button onClick={nextStatus}>
            Suivant : {statusList[currentState+1]}
        </button>
    );
    if (currentState >= 6)
    {
        nextButton = (<></>);
    }

    // Admin view
    if (isOwner) {
        return (
            <div>
                <div>
                    Etape : {statusList[currentState]}
                </div>
                {nextButton}                
            </div>
        );
    }

    return (
        <div>
            <div>
                Etape : {statusList[currentState]}
            </div>
        </div>
    );
}

export default Workflow;