const ClaudeBrain = require('./memory');

async function testMemory() {
  console.log('Testing Claude Brain Memory System...\n');
  
  const brain = new ClaudeBrain();
  
  // Initialize
  console.log('1. Initializing brain...');
  await brain.initialize();
  
  // Test checkpoint
  console.log('\n2. Creating checkpoint...');
  await brain.checkpoint('Testing memory system');
  
  // Test TODO
  console.log('\n3. Adding TODO...');
  await brain.addTodo('Implement vendor sync system', 'high');
  
  // Test decision
  console.log('\n4. Recording decision...');
  await brain.addDecision({
    title: 'Use YAML for configuration',
    reasoning: 'Human-readable and widely supported',
    alternatives: ['JSON', 'TOML']
  });
  
  // Test pattern learning
  console.log('\n5. Learning pattern...');
  await brain.learnPattern({
    category: 'error-handling',
    pattern: 'try-catch with user-friendly messages',
    example: 'try { ... } catch (e) { console.error("User-friendly:", e.message) }'
  });
  
  // Get status
  console.log('\n6. Getting status...');
  const status = await brain.getStatus();
  console.log('Status:', status);
  
  console.log('\n✅ Memory system test complete!');
}

testMemory().catch(console.error);