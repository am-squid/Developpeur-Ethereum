// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Whitelist {
    struct Person {
        string name;
        uint age;
    }

    Person[] public persons;

    function addPerson(string memory _name, uint _age) public {
        Person memory person;
        person.name = _name;
        person.age = _age;
    }
}