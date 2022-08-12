#!/usr/bin/env node

const { program } = require('commander');
const { init } = require('../src/commands/init');
const { provision } = require('../src/commands/provision');

program
  .command('init')
  .alias('i')
  .description('Prepare AWS account for provisioning')
  .action(init);

  program
  .command('provision')
  .alias('p')
  .description('Provision Seymour resources')
  .action(provision);

program.parse(process.argv);
