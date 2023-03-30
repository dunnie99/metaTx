const {DefenderRelayProvider, DefenderRelaySigner,} = require('defender-relay-client/lib/ethers');
const { ethers } = require('hardhat');
const { writeFileSync } = require('fs');
  
  async function main() {
    require('dotenv').config()
    const credentials = {
      apiKey: process.env.RELAYER_API_KEY,
      apiSecret: process.env.RELAYER_API_SECRET,
    };
    const provider = new DefenderRelayProvider(credentials);
    const relaySigner = new DefenderRelaySigner(credentials, provider, {
      speed: 'fast',
    });
  
    const Forwarder = await ethers.getContractFactory('MinimalForwarder');
    const forwarder = await Forwarder.connect(relaySigner)
      .deploy()
      .then((f: { deployed: () => any }) => f.deployed());
  
    const swap = await ethers.getContractFactory('tokenSwapping');
    const Swap = await swap.connect(relaySigner)
      .deploy(forwarder.address)
      .then((f: { deployed: () => any }) => f.deployed());
      console.log(`tokenSwapping address: ${Swap.address}`)
  
    writeFileSync(
      'deploy.json',
      JSON.stringify(
        {
          MinimalForwarder: forwarder.address,
          Swapping: Swap.address,
        },
        null,
        2
      )
    )
  
    console.log(
      `MinimalForwarder: ${forwarder.address}\nSwapping: ${Swap.address}`
    )
  }
  
  if (require.main === module) {
    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error)
        process.exit(1)
      })
  }