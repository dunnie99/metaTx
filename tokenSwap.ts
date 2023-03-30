import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { providers } from "ethers";

async function main() {
    /// contract addresses
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    //const USDC ="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";


    /// Token holders
    const daiHolder = "0xb527a981e1d415AF696936B3174f2d7aC8D11369";
    const UniHolder = "0x47173B170C64d16393a52e6C480b3Ad8c302ba1e";
    //const UsdcHolder = "0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9";

    //Impersonation
    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    await helpers.impersonateAccount(daiHolder);
    const impersonatedSigner1 = await ethers.getSigner(daiHolder);

    //const helpers = require("@nomicfoundation/hardhat-network-helpers");
    await helpers.impersonateAccount(UniHolder);
    const impersonatedSigner2 = await ethers.getSigner(UniHolder);

    //const helper3 = require("@nomicfoundation/hardhat-network-helpers");
    //await helpers.impersonateAccount(UsdcHolder);
    //const impersonatedSigner3 = await ethers.getSigner(UsdcHolder);
    
/// deploying tokenSwap contract
    const tokenSwap = await ethers.getContractFactory("tokenSwapping");
    const TokenSwap = await tokenSwap.deploy();
    await TokenSwap.deployed();
    const swapContract = TokenSwap.address;
    console.log(`TokenSwapping Address is ${swapContract}`);
    

///getting all token contract address.
    const DaiContract = await ethers.getContractAt("IToken", DAI);
    const UniContract = await ethers.getContractAt("IToken", UNI);
    //const UsdcContract = await ethers.getContractAt("IToken", USDC);


///checking the balanceOf token holders

    const daiHolderBalance = await DaiContract.balanceOf(daiHolder);
    console.log(`daiHolderBalance ${daiHolderBalance}`);

    const uniHolderBalance = await UniContract.balanceOf(UniHolder);
    console.log(`uniHolderBalance ${uniHolderBalance}`);

    // const usdcHolderBalance = await UsdcContract.balanceOf(UsdcHolder);
    // console.log(`usdcBalance ${usdcHolderBalance}`);

/// setBalance

    await helpers.setBalance(daiHolder, 10000000000000000000000000);
    await helpers.setBalance(UniHolder, 10000000000000000000000000);
    //await helpers.setBalance(UsdcHolder, 10000000000000000000000000);    

///Approving contract to spend token
// 666 532 251 525 266 654
//39 133 023 398 251 095 670 503 376 DAI
//13 228 435 176 618 083 367 446 970 LINK
//217 000 000 000 000 USDC

    //Dai in contract
    const allowanceValue = await ethers.utils.parseEther("2000");
    await DaiContract.connect(impersonatedSigner1).approve(swapContract, allowanceValue);
    await DaiContract.connect(impersonatedSigner1).transferFrom(impersonatedSigner1.address, swapContract, allowanceValue);
    const daiContractBalance = await DaiContract.balanceOf(swapContract);
    console.log(`Contract DAI balance is ${daiContractBalance}`);
    //Link in contract
    await UniContract.connect(impersonatedSigner2).approve(TokenSwap.address, allowanceValue);
    await UniContract.connect(impersonatedSigner2).transferFrom(impersonatedSigner2.address, swapContract, allowanceValue);
    const UniContractBalance = await UniContract.balanceOf(swapContract);
    console.log(`Contract UNI balance is ${UniContractBalance}`);

    //Usdc in contract  21 657 179 700 340

    // await UsdcContract.connect(impersonatedSigner3).approve(TokenSwap.address, allowanceValue);
    // await UsdcContract.connect(impersonatedSigner3).transferFrom(impersonatedSigner3.address, swapContract, allowanceValue);
    // const UsdcContractBalance = await UsdcContract.balanceOf(swapContract);
    // console.log(`Contract USDC balance is ${UsdcContractBalance}`);


    //// SWAPPING ETH AND TOKENS

///  SWAP ETH to DAI
//check uniHolder DAIbalance
    const uniHolderDaiBalance = await DaiContract.balanceOf(UniHolder);
    console.log(`uniHolderDaiBalance ${uniHolderDaiBalance}`);
    const sent = await ethers.utils.parseEther("0.10");
    const swapEthToDai = await TokenSwap.connect(impersonatedSigner2).swapETHDAI({
        value: sent,
    });

    const uniHolderDaiBalanceAfter = await DaiContract.balanceOf(UniHolder);
    console.log(`uniHolderDaiBalance ${uniHolderDaiBalanceAfter}`);
    console.log("ETH TO DAI Swapping successfully");


// SWAP ETH TO UNI


    const DaiHolderUniBalanceBefore = await    UniContract.balanceOf(daiHolder);
    console.log(`DaiHolderUniBalance ${DaiHolderUniBalanceBefore}`);
    const ethSent = await ethers.utils.parseEther("0.20");
    const swapEthToUni = await TokenSwap.connect(impersonatedSigner1).swapETHUNI({
        value: ethSent,
    });

    const uniHolderBalanceAfter = await UniContract.balanceOf(daiHolder);
    console.log(`uniHolderDaiBalance ${uniHolderBalanceAfter}`);
    console.log("ETH TO UNI Swapping successfully")

    

















    
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  