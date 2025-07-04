const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');

class ClaudeBrain {
  constructor() {
    this.basePath = '.claude';
    this.memoryPath = path.join(this.basePath, 'memory');
    this.memory = {
      context: {},
      changelog: [],
      todos: [],
      decisions: [],
      solutions: new Map()
    };
  }

  // Initialize or load existing brain
  async initialize() {
    try {
      // Load context
      const contextPath = path.join(this.memoryPath, 'context.yaml');
      const contextData = await fs.readFile(contextPath, 'utf8');
      this.memory.context = yaml.parse(contextData);
      
      // Update last active
      this.memory.context.brain_meta.last_active = new Date().toISOString();
      
      // Load other memory components
      await this.loadChangelog();
      await this.loadTodos();
      await this.loadDecisions();
      
      console.log('🧠 Brain loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize brain:', error.message);
      return false;
    }
  }

  // Save current state
  async checkpoint(message = '') {
    try {
      // Update context
      this.memory.context.brain_meta.last_checkpoint = new Date().toISOString();
      await this.saveContext();
      
      // Add to changelog
      await this.addChangelogEntry({
        timestamp: new Date().toISOString(),
        type: 'checkpoint',
        message: message || 'Auto checkpoint',
        state: this.memory.context.current_state
      });
      
      console.log('✓ Checkpoint saved');
      return true;
    } catch (error) {
      console.error('Checkpoint failed:', error.message);
      return false;
    }
  }

  // Context management
  async saveContext() {
    const contextPath = path.join(this.memoryPath, 'context.yaml');
    await fs.writeFile(contextPath, yaml.stringify(this.memory.context, null, 2));
  }

  async updateContext(updates) {
    // Deep merge updates into context
    this.mergeDeep(this.memory.context, updates);
    await this.saveContext();
  }

  // Changelog management
  async loadChangelog() {
    try {
      const changelogPath = path.join(this.memoryPath, 'changelog.md');
      const content = await fs.readFile(changelogPath, 'utf8');
      // Parse markdown into structured data
      this.memory.changelog = this.parseChangelogMd(content);
    } catch (error) {
      this.memory.changelog = [];
    }
  }

  async addChangelogEntry(entry) {
    const changelogPath = path.join(this.memoryPath, 'changelog.md');
    const timestamp = new Date().toISOString();
    const logEntry = `\n## ${timestamp}\n- **Type**: ${entry.type}\n- **Message**: ${entry.message}\n`;
    
    await fs.appendFile(changelogPath, logEntry);
    this.memory.changelog.push(entry);
  }

  // TODO management
  async loadTodos() {
    try {
      const todosPath = path.join(this.memoryPath, 'todos.md');
      const content = await fs.readFile(todosPath, 'utf8');
      this.memory.todos = this.parseTodosMd(content);
    } catch (error) {
      this.memory.todos = [];
    }
  }

  async updateTodos(todos) {
    const todosPath = path.join(this.memoryPath, 'todos.md');
    let content = '# Project TODOs\n\n## Current Sprint\n';
    
    for (const todo of todos) {
      const checkbox = todo.completed ? '[x]' : '[ ]';
      const priority = todo.priority ? ` [${todo.priority}]` : '';
      content += `- ${checkbox} ${todo.task}${priority}\n`;
    }
    
    await fs.writeFile(todosPath, content);
    this.memory.todos = todos;
  }

  async addTodo(task, priority = 'normal') {
    const newTodo = {
      id: Date.now(),
      task,
      priority,
      completed: false,
      created: new Date().toISOString()
    };
    
    this.memory.todos.push(newTodo);
    await this.updateTodos(this.memory.todos);
    return newTodo;
  }

  // Decision tracking
  async loadDecisions() {
    try {
      const decisionsPath = path.join(this.memoryPath, 'decisions.log');
      const content = await fs.readFile(decisionsPath, 'utf8');
      this.memory.decisions = this.parseDecisionsLog(content);
    } catch (error) {
      this.memory.decisions = [];
    }
  }

  async addDecision(decision) {
    const decisionsPath = path.join(this.memoryPath, 'decisions.log');
    const timestamp = new Date().toISOString();
    const entry = `\n## ${timestamp}\n**Decision**: ${decision.title}\n**Reasoning**: ${decision.reasoning}\n**Alternatives**: ${decision.alternatives.join(', ')}\n`;
    
    await fs.appendFile(decisionsPath, entry);
    this.memory.decisions.push({
      timestamp,
      ...decision
    });
  }

 // Pattern learning
async learnPattern(pattern) {
  const patternsDir = path.join(this.basePath, 'patterns');
  const patternsPath = path.join(patternsDir, 'code-style.yaml');
  
  try {
    // Ensure directory exists
    await fs.mkdir(patternsDir, { recursive: true });
    
    let existing = { patterns: {}, detected: false };
    try {
      existing = yaml.parse(await fs.readFile(patternsPath, 'utf8'));
    } catch (e) {
      // File doesn't exist, use defaults
    }
    
    if (!existing.patterns[pattern.category]) {
      existing.patterns[pattern.category] = [];
    }
    
    existing.patterns[pattern.category].push({
      pattern: pattern.pattern,
      example: pattern.example,
      learned: new Date().toISOString()
    });
    
    existing.detected = true;
    
    await fs.writeFile(patternsPath, yaml.stringify(existing, null, 2));
    console.log(`📝 Learned new ${pattern.category} pattern`);
  } catch (error) {
    console.error('Failed to save pattern:', error.message);
  }
}

  // Solution memory
  async rememberSolution(problem, solution) {
    const solutionsPath = path.join(this.memoryPath, 'solutions.yaml');
    
    try {
      let solutions = {};
      try {
        solutions = yaml.parse(await fs.readFile(solutionsPath, 'utf8'));
      } catch (e) {
        // File doesn't exist yet
      }
      
      const key = this.generateProblemKey(problem);
      solutions[key] = {
        problem,
        solution,
        timestamp: new Date().toISOString(),
        timesUsed: 0
      };
      
      await fs.writeFile(solutionsPath, yaml.stringify(solutions, null, 2));
      this.memory.solutions.set(key, solutions[key]);
    } catch (error) {
      console.error('Failed to save solution:', error.message);
    }
  }

  async findSimilarSolutions(problem) {
    const solutionsPath = path.join(this.memoryPath, 'solutions.yaml');
    
    try {
      const solutions = yaml.parse(await fs.readFile(solutionsPath, 'utf8'));
      const keywords = this.extractKeywords(problem);
      
      const matches = [];
      for (const [key, sol] of Object.entries(solutions)) {
        const similarity = this.calculateSimilarity(keywords, this.extractKeywords(sol.problem));
        if (similarity > 0.5) {
          matches.push({
            ...sol,
            similarity
          });
        }
      }
      
      return matches.sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      return [];
    }
  }

  // Helper methods
  parseChangelogMd(content) {
    // Simple parser - can be enhanced
    const entries = [];
    const sections = content.split(/^## /m);
    
    for (const section of sections) {
      if (section.trim()) {
        const lines = section.trim().split('\n');
        const timestamp = lines[0];
        entries.push({
          timestamp,
          content: lines.slice(1).join('\n')
        });
      }
    }
    
    return entries;
  }

  parseTodosMd(content) {
    const todos = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const todoMatch = line.match(/^- \[([ x])\] (.+?)(\[(.+)\])?$/);
      if (todoMatch) {
        todos.push({
          completed: todoMatch[1] === 'x',
          task: todoMatch[2].trim(),
          priority: todoMatch[4] || 'normal'
        });
      }
    }
    
    return todos;
  }

  parseDecisionsLog(content) {
    // Similar to changelog parser
    return this.parseChangelogMd(content);
  }

  generateProblemKey(problem) {
    // Simple key generation - can be improved
    return problem.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
  }

  extractKeywords(text) {
    // Simple keyword extraction - can be enhanced with NLP
    return text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .filter(word => !['the', 'and', 'for', 'with', 'from'].includes(word));
  }

  calculateSimilarity(keywords1, keywords2) {
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  mergeDeep(target, source) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(source[key], this.mergeDeep(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }

  // Status report
  async getStatus() {
    const status = {
      lastActive: this.memory.context.brain_meta.last_active,
      currentWork: this.memory.context.current_state.working_on,
      todosCount: this.memory.todos.filter(t => !t.completed).length,
      completedToday: this.memory.changelog.filter(entry => {
        const entryDate = new Date(entry.timestamp).toDateString();
        return entryDate === new Date().toDateString();
      }).length,
      patternsLearned: Object.keys(this.memory.context.patterns_learned || {}).length
    };
    
    return status;
  }
}

module.exports = ClaudeBrain;