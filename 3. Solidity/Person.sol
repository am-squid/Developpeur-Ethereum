// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Whitelist {
    struct Person {
        string name;
        uint age;
    }

    Person[] public persons;

    /*
    * Adds a person to the list
    * @param _name string name of the person
    * @param _age uint age of the person
    */
    function add(string memory _name, uint _age) public {
        Person memory person;
        person.name = _name;
        person.age = _age;
        //Adding the person to the list
        persons.push(person);
    }

    /*
    *  Removes the last person added to the list
    */
    function remove() public {
        persons.pop();
    }
}