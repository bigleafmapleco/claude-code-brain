#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');
const chalk = require('chalk');
const inquirer = require('inquirer');

console.log(chalk.blue.bold(`
🧠 Claude Code Brain - Initialization
====================================
`));

async function init() {
  console.log(chalk.yellow('Initializing Claude Code Brain in your project...\n'));
  
  // Check if already initialized
  try {
    await fs.access('.claude');
    const { overwrite } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: 'Claude Brain already initialized. Reinitialize?',
      default: false
    }]);
    
    if (!overwrite) {
      console.log(chalk.gray('Initialization cancelled.'));
      process.exit(0);
    }
  } catch (e) {
    // Directory doesn't exist, good to proceed
  }
  
  // Create directory structure
  console.log(chalk.gray('Creating brain structure...'));
  
  const dirs = [
    '.claude/memory',
    '.claude/vendor-specs',
    '.claude/patterns',
    '.claude/agents'
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
    console.log(chalk.green('✓'), chalk.gray(dir));
  }
  
  // Initialize context
  console.log(chalk.gray('\nInitializing brain context...'));
  
  const context = {
    project: {
      name: path.basename(process.cwd()),
      type: 'application',
      phase: 'initial-development',
      started: new Date().toISOString().split('T')[0]
    },
    brain_version: '0.1.0',
    tech_stack: {},
    configuration: {
      explanation_level: 'medium',
      auto_checkpoint: true,
      vendor_sync_interval: 'daily'
    },
    patterns_learned: {},
    user_preferences: {}
  };
  
  await fs.writeFile(
    '.claude/memory/context.yaml',
    yaml.stringify(context)
  );
  
  console.log(chalk.green('✓'), chalk.gray('Brain context initialized'));
  
  // Create initial files
  const initialFiles = {
    '.claude/memory/changelog.md': '# Project Changelog\n\n## Initialization\n- Project initialized with Claude Code Brain\n',
    '.claude/memory/todos.md': '# Project TODOs\n\n## Current Sprint\n- [ ] Complete project setup\n- [ ] Define core features\n',
    '.claude/memory/decisions.log': '# Architectural Decisions\n\n',
    '.claude/patterns/code-style.yaml': 'patterns: {}\ndetected: false\n'
  };
  
  for (const [file, content] of Object.entries(initialFiles)) {
    await fs.writeFile(file, content);
  }
  
  console.log(chalk.green.bold('\n✨ Claude Code Brain initialized successfully!\n'));
  
  console.log(chalk.cyan('Next steps:'));
  console.log(chalk.gray('1. Run'), chalk.white('claude-code-brain start'), chalk.gray('to begin your session'));
  console.log(chalk.gray('2. Open Claude Code and start building!'));
}

init().catch(console.error);