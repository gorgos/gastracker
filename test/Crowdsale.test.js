const { BN, ether, expectEvent } = require('openzeppelin-test-helpers')
require('chai').should()

const { createProxyContract, getGasResults, storeResults } = require('../')

const Crowdsale = artifacts.require('CrowdsaleMock')
const SimpleToken = artifacts.require('SimpleToken')

contract('Crowdsale', function([, investor, wallet, purchaser]) {
  const rate = new BN(1)
  const value = ether('42')
  const tokenSupply = new BN('10').pow(new BN('22'))
  const expectedTokenAmount = rate.mul(value)

  context('with token', async function() {
    beforeEach(async function() {
      this.token = createProxyContract(await SimpleToken.new(), 'SimpleToken')
    })

    context('once deployed', async function() {
      beforeEach(async function() {
        this.crowdsale = createProxyContract(
          await Crowdsale.new(rate, wallet, this.token.address),
          'Crowdsale'
        )
        await this.token.transferTest(
          this.crowdsale.address,
          tokenSupply.sub(new BN(1))
        )
        await this.token.transferTest(this.crowdsale.address, new BN(1))
      })

      describe('accepting payments', function() {
        describe('buyTokens', function() {
          it('should accept payments', async function() {
            await this.crowdsale.buyTokensTest(purchaser, {
              value: tokenSupply,
              from: investor,
            })
          })
        })
      })

      describe('low-level purchase', function() {
        it('should log purchase', async function() {
          const { logs } = await this.crowdsale.buyTokensTest(investor, {
            value: value.div(new BN(2)),
            from: purchaser,
          })
          expectEvent.inLogs(logs, 'TokensPurchased', {
            purchaser: purchaser,
            beneficiary: investor,
            value: value.div(new BN(2)),
            amount: expectedTokenAmount.div(new BN(2)),
          })
        })

        it('should assign tokens to beneficiary', async function() {
          await this.crowdsale.buyTokensTest(investor, {
            value: value.mul(new BN(2)),
            from: purchaser,
          })
          ;(await this.token.balanceOf(investor)).should.be.bignumber.equal(
            expectedTokenAmount.mul(new BN(2))
          )
        })
      })
    })
  })

  after(async () => {
    const gasResults = getGasResults()
    console.log(JSON.stringify(gasResults))

    storeResults('./data.json')
  })
})
