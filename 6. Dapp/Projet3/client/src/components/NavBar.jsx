import { useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function NavBar() {
    const { state: { contract, accounts } } = useEth();

    // 
    const refeshCurrentStatus = async () => {
        
    }

    const nextStatus = async () => {
        await contract.methods.startProposalsRegistering().send({ from: accounts[0]});

    }

    useEffect(() => {

    });

    return (
        <div>
            <div>
                Etape : test
            </div>
            <button onClick={nextStatus}>
                Next Step
            </button>
        </div>
    );
}

export default NavBar;