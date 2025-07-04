#!/usr/bin/env node

const { program } = require('commander');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('Claude Code Brain - Intelligent project framework');

program
  .command('init')
  .description('Initialize Claude Code Brain in current project')
  .action(() => {
    require('./init');
  });

program
  .command('start')
  .description('Start a new Claude Code session')
  .action(() => {
    require('./start');
  });

program
  .command('sync')
  .description('Sync vendor specifications')
  .action(async () => {
    const VendorSpecManager = require('./vendor-sync');
    const vendor = new VendorSpecManager();
    await vendor.initialize();
    await vendor.detectProjectStack();
    await vendor.syncAll();
  });

program
  .command('status')
  .description('Show brain status')
  .action(async () => {
    const ClaudeBrain = require('./memory');
    const brain = new ClaudeBrain();
    await brain.initialize();
    const status = await brain.getStatus();
    console.log('Brain Status:', status);
  });

program.parse(process.argv);