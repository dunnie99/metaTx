// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./IToken.sol";

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

    
contract tokenSwapping is ERC2771Context {


    AggregatorV3Interface ETHUSD = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
    AggregatorV3Interface DAIUSD = AggregatorV3Interface(0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9);
    AggregatorV3Interface UNIUSD = AggregatorV3Interface(0x553303d460EE0afB37EdFf9bE42922D8FF63220e);
    
    address Owner;
    IToken internal DAI;
    IToken internal UNI;
    //IToken internal USDC;
    int tokenDecimal;

    constructor(MinimalForwarder _forwarder) ERC2771Context(address(_forwarder)){
        
        tokenDecimal = 1e8;
        DAI = IToken(0x6B175474E89094C44Da98b954EedeAC495271d0F);
        UNI = IToken(0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984);
        //USDC = IToken(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
        Owner = msg.sender;
    }

    modifier onlyOwner() {
        require (msg.sender == Owner, "not Owner");
        _;
    }

    function transfer_(IToken token, int amount_, address _to) internal returns(bool){
        bool check = token.transfer( _to, uint (amount_));
        require(check, "Transaction failed");
        return check;
    }

    function transferFrom_(IToken token, address from, int _amount) internal returns(bool) {
        bool takeToken = token.transferFrom(from, address(this), uint(_amount));
        return takeToken;
    }

    function getPrice(AggregatorV3Interface _token2swap, int _decimal) public view returns (int){
    (, int256 answer, , , ) = _token2swap.latestRoundData();

    return (answer / _decimal); 
    }


    function swapETHDAI() payable external {
        require(msg.value > 0, "Insufficient Ether");
        int ethPrice = getPrice(ETHUSD, tokenDecimal);
        //int daiPrice = getPrice(DAIUSD, tokenDecimal);
        int daiOut = ((int(msg.value) * ethPrice) / 1);
        transfer_(DAI, daiOut, msg.sender);
         
    }

    function swapETHUNI() payable external {
        require(msg.value > 0, "Insufficient Ether");
        int ethPrice = getPrice(ETHUSD, tokenDecimal);
        int uniPrice = getPrice(UNIUSD, tokenDecimal);
        int uniOut = ((int(msg.value) * ethPrice) / uniPrice);
        transfer_(UNI, uniOut, msg.sender);
         
    }


    function swapDAIUNI(uint _amount) external {
        require(_amount > 0, "Insufficient Dai");
        bool status = transferFrom_(DAI, msg.sender, int (_amount));
        require(status, "Insufficient liquidity");
        int daiPrice = getPrice(DAIUSD, tokenDecimal);
        int uniPrice = getPrice(UNIUSD, tokenDecimal);
        int uniOut = ((int(_amount) * daiPrice) / uniPrice);

        transfer_(UNI, uniOut, msg.sender);
         
    }


    function swapUNIDAI(uint _amount) payable external {
        require(_amount > 0, "Insufficient Link");
        bool status = transferFrom_(UNI, msg.sender, int (_amount));
        require(status, "Insufficient liquidity");
        int uniPrice = getPrice(UNIUSD, tokenDecimal);
        int daiPrice = getPrice(DAIUSD, tokenDecimal);
        int daiOut = ((int(_amount) * uniPrice) / daiPrice);
        transfer_(DAI, daiOut, msg.sender);
         
    }


// WITHDRAW AND BALANCEOF CONTRACT TOKENS.


    function balanceOf_(IToken _token) public view returns(uint){
        uint tokenBalance = _token.balanceOf(address(this));
        return tokenBalance;
    }
    function withdraw(IToken token, uint amount_) public onlyOwner() {
        token.transfer(msg.sender, amount_);
    
    }











}





















































































