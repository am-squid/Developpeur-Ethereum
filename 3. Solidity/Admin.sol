// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable{
    mapping(address=>bool) private _whitelist;
    mapping(address=>bool) private _blacklist;

    event Whitelisted(address _who);
    event Blacklisted(address _who);

    // Adds an address to the whitelist, only for owner of the smartcontract
    function whitelist(address _address) public onlyOwner{
        require(!_whitelist[_address], "The address is already whitelisted");
        require(!_blacklist[_address], "The address is already blacklisted");
        _whitelist[_address] = true;
        emit Whitelisted(_address);
    }

    // Adds an address to the blacklist, only for owner of the smartcontract
    function blacklist(address _address) public onlyOwner{
        require(!_whitelist[_address], "The address is already whitelisted");
        require(!_blacklist[_address], "The address is already blacklisted");
        _blacklist[_address] = true;
        emit Blacklisted(_address);
    }

    //Returns true if the address is whitelisted
    function isWhitelisted(address _address) public view returns(bool){
        return _whitelist[_address];
    }

    //Returns true if the address is blacklisted
    function isBlacklisted(address _address) public view returns(bool){
        return _blacklist[_address];
    }
}