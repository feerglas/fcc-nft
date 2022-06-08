const { network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log('####### deploy basic nft #######');
  arguments = [];
  const basicNft = await deploy('BasicNft', {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('####### verify basic nft #######');
    await verify(basicNft.address, arguments);
  }

  log('####### end basic nft #######');
};

module.exports.tags = ['all', 'basicnft', 'main'];
