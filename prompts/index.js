const fs = require('fs').promises;
const path = require('path');

class PromptManager {
  constructor() {
    this.promptsPath = path.join(__dirname);
    this.prompts = {};
  }

  async loadAll() {
    const files = [
      'initialization.md',
      'problem-solving.md',
      'building.md',
      'evaluation.md',
      'teaching.md'
    ];

    for (const file of files) {
      const name = path.basename(file, '.md');
      const content = await fs.readFile(path.join(this.promptsPath, file), 'utf8');
      this.prompts[name] = content;
    }

    console.log(`📚 Loaded ${Object.keys(this.prompts).length} prompt templates`);
    return this.prompts;
  }

  async getPrompt(name) {
    if (!this.prompts[name]) {
      const content = await fs.readFile(path.join(this.promptsPath, `${name}.md`), 'utf8');
      this.prompts[name] = content;
    }
    return this.prompts[name];
  }

  async generateContextualPrompt(context) {
    // Load base initialization
    const base = await this.getPrompt('initialization');
    
    // Add contextual information
    const contextBlock = `
## Current Session Context

Project: ${context.project.name}
Phase: ${context.project.phase}
Working On: ${context.current_state.working_on}
User Preferences: ${JSON.stringify(context.configuration.user_preferences, null, 2)}

## Recent Activity
${context.recent_activity || 'Starting fresh'}

## Active Patterns
${JSON.stringify(context.patterns_learned, null, 2)}

## Session Directive
Based on the context above, follow the behavioral directives in the initialization prompt and adapt your responses accordingly.
`;

    return base + '\n\n' + contextBlock;
  }

  async generateSessionPrompt(context, todos = []) {
    // Generate a concise prompt for the user to copy
    const todoList = todos
      .filter(t => !t.completed)
      .slice(0, 3)
      .map(t => `- ${t.task}${t.priority === 'high' ? ' [HIGH PRIORITY]' : ''}`)
      .join('\n');

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
  .join('\n') || '- Not yet defined'}

Top TODOs:
${todoList || '- No specific todos'}

Please:
1. Read the full context from .claude/memory/context.yaml
2. Check .claude/memory/changelog.md for recent changes
3. Review .claude/patterns/ for learned patterns
4. Load relevant vendor specs from .claude/vendor-specs/
5. Follow behavioral directives in prompts/initialization.md

Let's continue where we left off. What would you like to work on?
`;

    return prompt.trim();
  }

  async getPromptForMode(mode, context = {}) {
    // Return appropriate prompt based on the current mode
    const modeMap = {
      'problem': 'problem-solving',
      'build': 'building',
      'evaluate': 'evaluation',
      'teach': 'teaching',
      'init': 'initialization'
    };

    const promptName = modeMap[mode] || 'initialization';
    const prompt = await this.getPrompt(promptName);

    // Add mode-specific context if provided
    if (context && Object.keys(context).length > 0) {
      const contextSection = `
## Mode-Specific Context
${JSON.stringify(context, null, 2)}
`;
      return prompt + '\n\n' + contextSection;
    }

    return prompt;
  }

  async listAvailablePrompts() {
    const files = await fs.readdir(this.promptsPath);
    return files
      .filter(f => f.endsWith('.md'))
      .map(f => path.basename(f, '.md'));
  }
}

module.exports = PromptManager;