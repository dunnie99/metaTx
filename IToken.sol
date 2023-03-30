// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IToken {
    function approve(address _spender, uint256 _value) external;

    function balanceOf(address who) external view returns (uint256);

    function allowance(address _owner, address _spender)
        external
        returns (uint256 remaining); 

    function transfer(address to, uint256 amount) external returns(bool);
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}