import { useEffect } from "react";
import { useState } from "react";
import { useEth } from "../contexts/EthContext";

function Result ({currentState, proposals}) {
    const [winnerId, setWinnerId] = useState("");
    const { state: { contract, accounts } } = useEth();

    const updateWinnerId = async () => {
        console.log(await contract.methods.winningProposalID().call({from: accounts[0]}));
        setWinnerId(await contract.methods.winningProposalID().call({from: accounts[0]}));
    }

    useEffect(()=>{
        if (contract === null){
            return;
        }
        updateWinnerId();
    }, [contract, accounts]);

    let blockquote = (<></>);
    if(typeof proposals[winnerId] !== 'undefined'){
        blockquote = (
            <blockquote>
                {proposals[winnerId].description}
            </blockquote>
        );
        
    }
    return(
        <div className="resultContainer">
            <div>
                La proposition gagnante est la proposition n°{winnerId} :
                {blockquote}
            </div>
        </div>
    );
}

export default Result;