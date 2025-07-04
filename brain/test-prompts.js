const PromptManager = require('../prompts');
const ClaudeBrain = require('./memory');
const chalk = require('chalk');

async function testPrompts() {
  console.log(chalk.blue.bold('Testing Prompt System...\n'));
  
  const promptManager = new PromptManager();
  const brain = new ClaudeBrain();
  
  try {
    // Test 1: Load all prompts
    console.log(chalk.yellow('1. Loading all prompts...'));
    const prompts = await promptManager.loadAll();
    console.log(chalk.green('✓ Loaded prompts:'), Object.keys(prompts));
    
    // Test 2: List available prompts
    console.log(chalk.yellow('\n2. Listing available prompts...'));
    const available = await promptManager.listAvailablePrompts();
    console.log(chalk.green('✓ Available:'), available);
    
    // Test 3: Get specific prompt
    console.log(chalk.yellow('\n3. Getting problem-solving prompt...'));
    const problemPrompt = await promptManager.getPrompt('problem-solving');
    console.log(chalk.green('✓ Prompt loaded, length:'), problemPrompt.length, 'characters');
    console.log(chalk.gray('Preview:'), problemPrompt.substring(0, 100) + '...');
    
    // Test 4: Initialize brain and generate contextual prompt
    console.log(chalk.yellow('\n4. Generating contextual prompt...'));
    await brain.initialize();
    const contextualPrompt = await promptManager.generateContextualPrompt(brain.memory.context);
    console.log(chalk.green('✓ Generated contextual prompt'));
    console.log(chalk.gray('Contains project info:'), contextualPrompt.includes(brain.memory.context.project.name));
    
    // Test 5: Generate session prompt (what user actually copies)
    console.log(chalk.yellow('\n5. Generating session prompt...'));
    const sessionPrompt = await promptManager.generateSessionPrompt(
      brain.memory.context,
      brain.memory.todos
    );
    console.log(chalk.green('✓ Generated session prompt:'));
    console.log(chalk.white.bgBlack('\n' + sessionPrompt + '\n'));
    
    // Test 6: Get prompt for different modes
    console.log(chalk.yellow('6. Testing mode-specific prompts...'));
    const modes = ['problem', 'build', 'evaluate', 'teach'];
    for (const mode of modes) {
      const modePrompt = await promptManager.getPromptForMode(mode);
      console.log(chalk.green(`✓ ${mode} mode:`), modePrompt.substring(0, 50) + '...');
    }
    
    // Test 7: Mode with context
    console.log(chalk.yellow('\n7. Testing mode with context...'));
    const buildContext = {
      feature: 'User Authentication',
      stage: 'implementing',
      patterns: ['functional-components', 'error-boundaries']
    };
    const buildPrompt = await promptManager.getPromptForMode('build', buildContext);
    console.log(chalk.green('✓ Build mode with context added'));
    console.log(chalk.gray('Contains feature name:'), buildPrompt.includes('User Authentication'));
    
    console.log(chalk.green.bold('\n✅ All prompt system tests passed!'));
    
    // Show summary
    console.log(chalk.cyan('\n📊 Summary:'));
    console.log(chalk.white('- Prompts loaded:', Object.keys(prompts).length));
    console.log(chalk.white('- Brain initialized:', brain.memory.context.project.name));
    console.log(chalk.white('- Session prompt ready:', sessionPrompt.split('\n').length, 'lines'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error.message);
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

// Run tests
testPrompts().catch(console.error);