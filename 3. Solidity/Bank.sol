// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

contract Bank{
    mapping(address=>uint) _balances;

    //Allow sender to deposit an amount to its address
    function deposit(uint _amount) public{
        _balances[msg.sender] += _amount;
    }

    //Transfert money from sender to recipient
    function transfert(address _recipient, uint _amount) public{
        require(_recipient != address(0), "You cannot transfer to the address zero");
        require(_amount > 0, "Negative or zero amount is forbidden");
        require(_balances[msg.sender] >= _amount, "Transfered amount exceed account balance");
        _balances[msg.sender] -= _amount;
        _balances[_recipient] += _amount;
    }

    //Returns balance of a given account
    function balanceOf(address _address) public view returns(uint){
        return _balances[_address];
    }
}