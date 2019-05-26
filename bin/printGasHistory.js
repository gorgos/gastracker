#! /usr/bin/env node

const asciichart = require('asciichart')
const fs = require('fs')
const program = require('commander')
program.version('1.0.0')

program
  .option('-f, --file-name <fileName>', 'data file with stored gas results')
  .option(
    '-c, --contract-name <contractName>',
    'the name of the target contract'
  )
  .option(
    '-n, --function-name <functionName>',
    'the name of the target function'
  )
  .option(
    '-s, --stats-name <statsName>',
    'the statistic name (mean, median, min, max)'
  )

program.parse(process.argv)

const printHistoryForFunction = (
  data,
  contractName,
  functionName,
  statsName
) => {
  const history = { results: {}, dates: [] }

  Object.keys(data)
    .sort()
    .forEach(timestamp => {
      Object.keys(data[timestamp][contractName]).forEach(_functionName => {
        if (_functionName === functionName) {
          history.results[functionName] = [
            ...(history.results[functionName]
              ? history.results[functionName]
              : []),
            data[timestamp][contractName][functionName][statsName],
          ]
          history.dates.push(new Date(parseInt(timestamp)))
        }
      })
    })

  console.log(`**************** ${functionName} ****************`)
  console.log(
    asciichart.plot(history.results[functionName], {
      height: 10,
      format: x => ('          ' + x.toFixed()).slice(-'          '.length),
    })
  )
  console.log(
    history.dates.reduce(
      (acc, date) => `${acc} ${date.getDate()}/${date.getMonth() + 1}`,
      ''
    )
  )
}

const printHistory = (fileName, contractName, functionName, statsName) => {
  try {
    fs.accessSync(fileName, fs.constants.R_OK | fs.constants.W_OK)
  } catch (err) {
    console.error(`Cannot read or write file: ${fileName}.`)
  }

  const data = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }))
  printHistoryForFunction(data, contractName, functionName, statsName)
}

printHistory(
  program.fileName,
  program.contractName,
  program.functionName,
  program.statsName
)
