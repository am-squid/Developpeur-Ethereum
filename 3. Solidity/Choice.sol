// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

contract Choice {

    mapping(address => uint) choices;

    function add(uint _myuint) public {
        choices[msg.sender] = _myuint;
    }
}