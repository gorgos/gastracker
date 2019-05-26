const fs = require('fs')
const stats = require('stats-lite')

const gasResults = new Map()

const createProxyContract = (contract, name) => {
  gasResults.set(name, new Map())

  const handler = {
    get: (target, prop) =>
      typeof target[prop] !== 'function'
        ? target[prop]
        : async (...args) => {
            const result = await target[prop].apply(this, args)

            if (result.receipt) {
              const currentResults = gasResults.get(name).get(prop)

              gasResults
                .get(name)
                .set(prop, [
                  ...(currentResults ? currentResults : []),
                  result.receipt.gasUsed,
                ])
            }

            return result
          },
  }

  return new Proxy(contract, handler)
}

const getGasResults = () => {
  const results = {}

  for (const [contractName, contractResults] of gasResults) {
    results[contractName] = {}

    for (const [functionName, result] of contractResults) {
      results[contractName][functionName] = {
        mean: Math.round(stats.mean(result)),
        median: stats.median(result),
        min: Math.min(...result),
        max: Math.max(...result),
      }
    }
  }

  return results
}

const storeResults = fileName => {
  try {
    fs.accessSync(fileName, fs.constants.R_OK | fs.constants.W_OK)
    const newResults = getGasResults()
    const oldResults = JSON.parse(
      fs.readFileSync(fileName, { encoding: 'utf-8' })
    )
    const results = oldResults
    results[Date.now()] = newResults
    fs.writeFileSync(fileName, JSON.stringify(results, null, 4), 'utf-8')
  } catch (err) {
    console.error(`Cannot read or write file: ${fileName}.`)
  }
}

module.exports = {
  createProxyContract,
  getGasResults,
  storeResults,
}
