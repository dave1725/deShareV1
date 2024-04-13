// SPDX-License-Identifier: MIT
// Project : BriefCase
// Owner : Techmac
pragma solidity ^0.8.9;

contract FileTransactions {
    bool public locked;
    address public owner;
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier nonReentrant() {
        require(!locked,"non-reentrant call detected");
        locked = true;
        _;
        locked = false;
    }

    struct sharedWith {
        string cid;
        bytes32 timestamp;
    }
    //mapping to store the CID and receiver
    mapping(address => sharedWith[]) dataHolder;

    event addedFileToIPFS(address _sender, string _cid);

    function addFileToIPFS(address _sender, string memory _cid) nonReentrant external {
        dataHolder[_sender].push(sharedWith(_cid,bytes32(block.timestamp)));
        emit addedFileToIPFS(_sender, _cid);
    }

    function getFiles(address _sender) external view returns(sharedWith[] memory){
        return dataHolder[_sender];
    }
}