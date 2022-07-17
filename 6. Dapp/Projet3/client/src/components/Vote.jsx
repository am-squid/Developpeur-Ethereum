import { useState } from "react";
import { useEth } from "../contexts/EthContext";

function Vote ({currentState, votes}) {
    const [voteInput, setVoteInput] = useState("");
    const { state: { contract, accounts } } = useEth();

    const handleVoteChange = e => {
        setVoteInput(e.target.value)
    }

    const sendVote = async () => {
        await contract.methods.setVote(voteInput).send({from: accounts[0]});
    }

    let voteBoard = (
        <div className="tableContainer">
            <table>
                <thead>
                    <tr>
                        <td>address</td>
                        <td>vote</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        votes.map((vote) => {
                            return (<tr><td>{vote.address}</td><td>{vote.proposalId}</td></tr>);
                        })
                    }
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <div className="voteInput">
                <input type="text" placeholder="Numéro de la proposition" onChange={handleVoteChange} value={voteInput}/>
                <button onClick={sendVote}>
                    Valider votre vote
                </button>
            </div>
            {voteBoard}

        </div>
    );
}

export default Vote;