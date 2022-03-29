
import yargs = require('yargs');
import { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';

interface ArgDefs {
  [key: string]: Options;
}

const argDefs: ArgDefs = {
  'filename': {
    type: 'string',
    default: 'guests.xlsx'
  },
}

const argv = yargs(hideBin(process.argv)).options(argDefs).parseSync();

console.log(`Hello world: ${argv.filename}`);
