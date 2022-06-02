// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

contract Whitelist {
    mapping(address => bool) whitelist;

    // New event, fired when a new adress is authorized in the whitelist
    event Authorized(address _who);

    function authorize(address _adress) public {
        whitelist[_adress] = true;
        emit Authorized(_adress);
    }
}