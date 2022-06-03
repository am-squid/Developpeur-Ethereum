// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

import "./ERC20Token.sol";

contract Crowdsale{
    uint public rate = 200;
    ERC20Token public token;

    constructor(uint256 initialSupply) {
        token = new ERC20Token(initialSupply);
    }

    receive() external payable{
        require(msg.value >= 0.1 ether, "You can't send less thant 0.1 ether");
        distribute(msg.value);
    }

    function distribute(uint256 amount) internal {
        uint256 tokenToSend = amount * rate;
        token.transfer(msg.sender, tokenToSend);
    }
}