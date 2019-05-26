#! /usr/bin/env node

const fs = require('fs')

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min
const getRandomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

const generateFakeDate = () =>
  getRandomDate(new Date(2018, 0, 1), new Date()).getTime()

const generateFakeResults = () => ({
  SimpleToken: {
    transferTest: {
      mean: Math.round(13236 * getRandomArbitrary(3, 9)),
      median: Math.round(38236 * getRandomArbitrary(3, 9)),
      min: Math.round(13236 * getRandomArbitrary(0, 2)),
      max: Math.round(53524 * getRandomArbitrary(10, 14)),
    },
  },
  Crowdsale: {
    buyTokensTest: {
      mean: Math.round(92351 * getRandomArbitrary(3, 9)),
      median: Math.round(92351 * getRandomArbitrary(3, 9)),
      min: Math.round(92351 * getRandomArbitrary(0, 2)),
      max: Math.round(92351 * getRandomArbitrary(10, 14)),
    },
  },
})

const insertFakeResults = async () => {
  const fileName = './data.json'

  try {
    fs.accessSync(fileName, fs.constants.R_OK | fs.constants.W_OK)
    const results = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }))

    for (let i = 0; i < 30; i++) {
      results[generateFakeDate()] = generateFakeResults()
    }
    fs.writeFileSync(fileName, JSON.stringify(results, null, 4), 'utf-8')
  } catch (err) {
    console.error(`Cannot read or write file: ${fileName}.`)
  }
}

insertFakeResults()
