#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const ClaudeBrain = require('./memory');
const VendorSpecManager = require('./vendor-sync');
const PromptManager = require('../prompts');

class BrainStartup {
  constructor() {
    this.brain = new ClaudeBrain();
    this.vendorManager = new VendorSpecManager();
    this.promptManager = new PromptManager();
  }

  async start() {
    console.clear();
    console.log(chalk.blue.bold(`
╔═══════════════════════════════════════╗
║       🧠 Claude Code Brain v0.1.0      ║
╚═══════════════════════════════════════╝
`));

    // Initialize brain
    console.log(chalk.yellow('Initializing brain...'));
    const brainInit = await this.brain.initialize();
    if (!brainInit) {
      console.error(chalk.red('Failed to initialize brain. Run claude-code-brain init first.'));
      process.exit(1);
    }

    // Get time-based greeting
    const greeting = this.getGreeting();
    console.log(chalk.green(`\n${greeting}!\n`));

    // Show project info
    const context = this.brain.memory.context;
    console.log(chalk.cyan('📁 Project:'), chalk.white(context.project.name));
    console.log(chalk.cyan('🚀 Phase:'), chalk.white(context.project.phase));
    console.log(chalk.cyan('💻 Working on:'), chalk.white(context.current_state.working_on || 'Nothing specific'));

    // Check last session
    const lastActive = new Date(context.brain_meta.last_active);
    const timeSince = this.getTimeSince(lastActive);
    console.log(chalk.cyan('⏰ Last active:'), chalk.white(timeSince));

    // Show todos
    await this.showTodos();

    // Check vendor specs
    await this.checkVendorSpecs();

    // Recent changes
    await this.showRecentChanges();

    // Generate session prompt
    const sessionPrompt = await this.generateSessionPrompt();
    
    console.log(chalk.blue('\n═══════════════════════════════════════\n'));
    console.log(chalk.green.bold('🎯 Ready to start coding!\n'));
    console.log(chalk.gray('Copy this prompt to Claude Code:\n'));
    console.log(chalk.white.bgBlack(sessionPrompt));
    
    // Save startup checkpoint
    await this.brain.checkpoint('Session started');
  }

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getTimeSince(date) {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Less than an hour ago';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString();
  }

  async showTodos() {
    console.log(chalk.yellow('\n📝 Current TODOs:'));
    
    const todos = this.brain.memory.todos
      .filter(todo => !todo.completed)
      .slice(0, 5);
    
    if (todos.length === 0) {
      console.log(chalk.gray('  No pending todos'));
      return;
    }

    todos.forEach((todo, index) => {
      const priority = todo.priority === 'high' ? chalk.red('[HIGH]') : 
                      todo.priority === 'low' ? chalk.gray('[LOW]') : '';
      console.log(chalk.white(`  ${index + 1}. ${todo.task} ${priority}`));
    });

    const remaining = this.brain.memory.todos.filter(t => !t.completed).length - 5;
    if (remaining > 0) {
      console.log(chalk.gray(`  ... and ${remaining} more`));
    }
  }

  async checkVendorSpecs() {
    console.log(chalk.yellow('\n📚 Vendor Specifications:'));
    
    // Initialize vendor manager
    await this.vendorManager.initialize();
    
    // Check for updates
    const needsUpdate = await this.vendorManager.checkForUpdates();
    
    if (needsUpdate.length > 0) {
      console.log(chalk.yellow(`  ⚠️  ${needsUpdate.length} specs need updating`));
      console.log(chalk.gray(`  Run 'npm run brain:sync' to update`));
    } else {
      console.log(chalk.green('  ✓ All specs up to date'));
    }

    // Show detected stack
    const manifest = await fs.readFile('.claude/vendor-specs/manifest.yaml', 'utf8');
    const sources = require('yaml').parse(manifest).sources;
    const enabled = Object.entries(sources)
      .filter(([_, source]) => source.enabled && source.detected)
      .map(([key, _]) => key);
    
    if (enabled.length > 0) {
      console.log(chalk.cyan('  📦 Detected stack:'), enabled.join(', '));
    }
  }

  async showRecentChanges() {
    console.log(chalk.yellow('\n🔄 Recent Activity:'));
    
    const today = new Date().toDateString();
    const todaysChanges = this.brain.memory.changelog
      .filter(entry => new Date(entry.timestamp).toDateString() === today);
    
    if (todaysChanges.length === 0) {
      console.log(chalk.gray('  No activity today'));
      return;
    }

    console.log(chalk.green(`  ${todaysChanges.length} changes today`));
    
    // Show last 3 changes
    todaysChanges.slice(-3).forEach(change => {
      const time = new Date(change.timestamp).toLocaleTimeString();
      console.log(chalk.gray(`  ${time} - ${change.type}: ${change.message || 'No message'}`));
    });
  }

  async generateSessionPrompt() {
    const context = this.brain.memory.context;
    const todos = this.brain.memory.todos
      .filter(t => !t.completed)
      .slice(0, 3)
      .map(t => `- ${t.task}${t.priority === 'high' ? ' [HIGH PRIORITY]' : ''}`);

    const prompt = `
I'm using Claude Code Brain to maintain context across our sessions.

Current Context:
- Project: ${context.project.name}
- Phase: ${context.project.phase}
- Working on: ${context.current_state.working_on || 'Starting fresh'}
- Brain Version: ${context.brain_version}

Tech Stack:
${Object.entries(context.tech_stack.decided || {})
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Top TODOs:
${todos.join('\n') || '- No specific todos'}

Please:
1. Read the full context from .claude/memory/context.yaml
2. Check .claude/memory/changelog.md for recent changes
3. Review .claude/patterns/ for learned patterns
4. Load relevant vendor specs from .claude/vendor-specs/

Let's continue where we left off. What would you like to work on?
`;

    return prompt.trim();
  }
}

// Run startup
if (require.main === module) {
  const startup = new BrainStartup();
  startup.start().catch(error => {
    console.error(chalk.red('Startup failed:'), error.message);
    process.exit(1);
  });
}

module.exports = BrainStartup;