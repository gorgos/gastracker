# gastracker

A simple utility for tracking gas costs of your Solidity contracts.

## Getting Started

```
npm install gastracker --save-dev
```

## Usage

### Inside your testing code

```
const { createProxyContract, storeResults } = require('gastracker')

beforeEach(async () => {
  this.token = createProxyContract(await SimpleToken.new(), 'SimpleToken')
})

after(() => {
  if (process.env.STORE_GAS_RESULTS === 'true') storeResults('./data.json')
})
```

### Command-line tool for printing results

```
$ printGasHistory --help
Usage: printGasHistory [options]

Options:
  -V, --version                       output the version number
  -f, --file-name <fileName>          data file with stored gas results
  -c, --contract-name <contractName>  the name of the target contract
  -n, --function-name <functionName>  the name of the target function
  -s, --stats-name <statsName>        the statistic name (mean, median, min, max)
  -h, --help                          output usage information
```

### Example

`$ printGasHistory -f data.json -c SimpleToken -n transferTest -s mean`

![screenshot](https://user-images.githubusercontent.com/659390/58376668-08405300-7fcc-11e9-8853-336229ffa8ab.png)

## API

### createProxyContract(targetContract, referenceName)

Create a proxy for the target contract and store information under given reference name. Can be used in `beforeEach` hook.

### storeResults(fileName)

Append results of the tracking to given file name. Can be used in `after` hook.

### getGasResults()

Receive the current results from the tracking of all proxy contracts.

## Built With

* [Commander](https://github.com/tj/commander.js/) - The complete solution for node.js command-line interfaces
* [asciicharts](https://github.com/kroitor/asciichart/) - Console ASCII line charts in pure Javascript
* [stats-lite](https://github.com/brycebaril/node-stats-lite/) - A fairly light statistical package.

## Contributing

Please feel free to create PR's or issues.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
