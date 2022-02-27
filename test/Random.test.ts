import { ContractFactory, Contract, ContractReceipt, ContractTransaction, Event } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { BigNumber, Bytes } from 'ethers';
import { ethers } from 'hardhat';

// import MessageNFT from '../artifacts/contracts/MessageNFT.sol/MessageNFT.json';

describe('Setup', function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  let collectionFactory: ContractFactory;
  let collection: Contract;
  console.log('Test');

  before(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    console.log('owner address: ', owner.address);

    // Deploy the test ERC721 contract and mint some NFTs
    collectionFactory = await ethers.getContractFactory('MessageNFT');
    collection = await collectionFactory.deploy();
    console.log('collection Address: ', collection.address);
  });

  describe('Mint some NFTs', function () {
    it('Should have minted 1 NFTs', async function () {
      const message = 'Hello Andrew';

      await collection.write(1, message);
      const newTokenURI = await collection.tokenURI(1);
      console.log('newTokenURI 0: ', newTokenURI);

      const ownerCheck = await collection.ownerOf(1);
      console.log('ownerCheck 0: ', ownerCheck);

      const messageCheck = await collection.getMessage(1);
      console.log('messageCheck 0: ', messageCheck);

      expect(messageCheck).to.equal(message);
    });

    it('Should fail to remint 1st NFT', async function () {
      const message = 'Hello Again';
      try {
        await collection.write(1, message);
        assert.fail('The transaction should have thrown an error');
      } catch (err: any) {
        console.log(err.message);
        assert.include(err.message, 'revert', "The error message should contain 'revert'");
      }
    });

    it('Should have a URI with SVG', async function () {
      const tokenURI = await collection.tokenURI(1);
      console.log('tokenURI 0: ', tokenURI);

      expect(tokenURI).length.to.be.greaterThan(0);
    });
  });

  console.log('test end');
});
