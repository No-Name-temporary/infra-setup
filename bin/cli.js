#!/usr/bin/env node

const { program } = require('commander');
const { init } = require('../src/commands/init');

program
  .command('init')
  .alias('i')
  .description('Provision Seymour resources')
  .action(init);

program.parse(process.argv);
