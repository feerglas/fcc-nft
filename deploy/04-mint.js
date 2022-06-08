const { ethers, network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();

  console.log('####### minting nfts #######');

  // mint basic
  const basicNft = await ethers.getContract('BasicNft', deployer);
  const basicMintTx = await basicNft.mintNft();
  await basicMintTx.wait(1);
  console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`);

  // mint random ipfs nft
  const randomIpfsNft = await ethers.getContract('RandomIpfsNft', deployer);
  const mintFee = await randomIpfsNft.getMintFee();

  const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
    value: mintFee.toString(),
  });
  const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);

  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 300000);
    randomIpfsNft.once('NftMinted', async () => {
      resolve();
    });

    if (developmentChains.includes(network.name)) {
      const requestId =
        randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatorV2Mock = await ethers.getContract(
        'VRFCoordinatorV2Mock',
        deployer
      );
      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        randomIpfsNft.address
      );
    }

    console.log(
      `Random ipfs nft index 0 has tokenURI: ${await randomIpfsNft.tokenURI(0)}`
    );
  });

  // dynamic nft
  const highValue = ethers.utils.parseEther('2000');
  const dynamicSvgNft = await ethers.getContract('DynamicSvgNft', deployer);
  const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString());
  await dynamicSvgNftMintTx.wait(1);
  console.log(
    `Dynamic nft index 0 has tokenURI: ${await dynamicSvgNft.tokenURI(0)}`
  );

  console.log('####### end minting nfts #######');
};

module.exports.tags = ['all', 'mint'];
