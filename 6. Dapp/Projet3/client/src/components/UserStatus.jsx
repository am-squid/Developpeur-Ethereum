import { useEffect } from "react";
import { useEth } from "../contexts/EthContext";

const UserStatus = (setIsOwnerHandle) => {
    const { state: { contract, accounts } } = useEth();

    const getOwner = async () => {
        if (contract) {
            let owner = await contract.methods.owner().call({ from: accounts[0] });
            if (accounts[0] == owner) {
                setIsOwnerHandle(true);
            }
        }
    }

    useEffect(() => {
        getOwner();
    }, [contract]);

}

export default UserStatus;