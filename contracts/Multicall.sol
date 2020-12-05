pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

/// @title Multicall - Aggregate results from multiple read-only function calls

contract Multicall {

    function aggregate(address[] memory targets, bytes[] memory callData) public returns (uint256 blockNumber, bytes[] memory returnData) {
        assert(targets.length == callData.length);

        blockNumber = block.number;
        returnData = new bytes[](targets.length);
        for(uint256 i = 0; i < targets.length; i++) {
            (bool success, bytes memory ret) = targets[i].call(callData[i]);
            require(success);
            returnData[i] = ret;
        }
    }
    // Helper functions
    function getSoxBalance(address addr) public view returns (uint256 balance) {
        balance = addr.balance;
    }
    function getBlockHash(uint256 blockNumber) public view returns (bytes32 blockHash) {
        blockHash = blockhash(blockNumber);
    }
    function getLastBlockHash() public view returns (bytes32 blockHash) {
        blockHash = blockhash(block.number - 1);
    }
    function getCurrentBlockTimestamp() public view returns (uint256 timestamp) {
        timestamp = block.timestamp;
    }
}