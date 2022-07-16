import { useEffect, useState } from "react";
import { useEth } from "../contexts/EthContext";

function Header() {
    const { state: { contract, accounts, isOwner } } = useEth();
    const [userAddress, setUserAddress] = useState("");

    const getUserRole = () => {
        if (isOwner) {
            return "Admin";
        }
        return "invité";
    }

    const updateUserAddress = () => {
        if(accounts !== null) {
            setUserAddress(accounts[0]);
        }        
    }

    useEffect(() => {
        updateUserAddress();
    }, [accounts]);

    return(
        <div className="header">
            <div className="logo">LOGO</div>
            <div className="profileCard">
                <span>Bonjour {userAddress}</span>
                <span>Vous êtes {getUserRole()} sur ce contrat</span>
            </div>
        </div>
    );
}

export default Header;