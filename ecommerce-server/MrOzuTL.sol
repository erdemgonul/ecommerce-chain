pragma solidity ^0.8.4;

contract MrOzuTL{
    mapping(address => uint) public balances;
    uint public totalSupply = 1000000*1000;
    string public name = "MrOzuTL";
    string public symbol = "MOT";
    uint public decimals = 3;
    
    event Transfer(address indexed from, address indexed to, uint value);
    
    constructor() payable{
        balances[msg.sender] = totalSupply;
    }
    
    function balanceOf(address owner) public view returns(uint) {
        return balances[owner];
    }
    
    function transfer(address to, uint value) public returns(bool) {
        require(balanceOf(msg.sender)>=value, 'balance too low');
        balances[to] += value;
        balances[msg.sender] -=value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function transfer(address from, address to, uint value) public returns(bool) {
        require(balanceOf(from)>=value, 'balance too low');
        balances[to] += value;
        balances[from] -=value;
        emit Transfer(from, to, value);
        return true;
    }
}