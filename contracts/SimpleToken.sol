pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract SimpleToken is ERC20, ERC20Detailed {
    uint256 number;

    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(DECIMALS));

    event TokenTest(string msg);

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("SimpleToken", "SIM", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function transferTest(address recipient, uint256 amount) public returns (bool) {
        if (now % 3 == 0) {
            number = number + 10;

            emit TokenTest('Token: Changed gas costs!');
        }

        transfer(recipient, amount);
    }
}