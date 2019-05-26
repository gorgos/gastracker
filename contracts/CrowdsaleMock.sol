pragma solidity ^0.5.2;

import 'openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol';

contract CrowdsaleMock is Crowdsale {
    uint256 number;
    event CrowdSaleTest(string msg);

    constructor (uint256 rate, address payable wallet, IERC20 token) public Crowdsale(rate, wallet, token) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function buyTokensTest(address beneficiary) public payable {
        if (now % 2 == 0) {
            number = number + 20;

            emit CrowdSaleTest('CrowdSale: Changed gas costs!');
        }

        buyTokens(beneficiary);
    }
}