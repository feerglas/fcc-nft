const fs = require('fs');
const { network, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log('####### deploy dynamic svg nft #######');

  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await ethers.getContract('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const lowSvg = await fs.readFileSync('./images/dynamicNft/frown.svg', {
    encoding: 'utf8',
  });
  const highSvg = await fs.readFileSync('./images/dynamicNft/happy.svg', {
    encoding: 'utf8',
  });

  const args = [ethUsdPriceFeedAddress, lowSvg, highSvg];

  const dynamicSvgNft = await deploy('DynamicSvgNft', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // Verify the deployment
  log('####### verify dynamic svg nft #######');
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...');
    await verify(dynamicSvgNft.address, args);
  }

  log('####### end dynamic svg nft #######');
};

module.exports.tags = ['all', 'dynamicsvg', 'main'];
