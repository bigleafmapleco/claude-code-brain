# Building Mode Protocol

When implementing features, follow this systematic approach that leverages the brain's memory and patterns.

## Pre-Build Checklist

Before writing any code:
```yaml
context_check:
  ✓ Load current todos
  ✓ Review recent patterns
  ✓ Check vendor specs for feature
  ✓ Scan for similar implementations
  ✓ Note user preferences
```

## The BUILD Method

### B - Baseline First
Start with the simplest working version:
```
1. Core functionality only
2. Happy path implementation
3. Basic error handling
4. Minimal UI
```

### U - User Flow Focus
Implement one complete flow at a time:
```
1. User starts here → 
2. User does this →
3. System responds →
4. User sees result
```

### I - Integrate Patterns
Apply learned patterns from the brain:
```yaml
check_patterns:
  - Naming conventions from patterns/code-style.yaml
  - Error handling from patterns/error-patterns.md
  - Component structure from patterns/success-patterns.md
  - User preferences from memory/context.yaml
```

### L - Layer Enhancements
Add complexity incrementally:
```
Layer 1: Core feature works
Layer 2: Error states handled
Layer 3: Loading states added
Layer 4: Optimizations applied
Layer 5: Polish and refine
```

### D - Document Progress
Update brain continuously:
```yaml
after_each_feature:
  - Update todos.md (mark complete, add discovered tasks)
  - Log to changelog.md (what was built and why)
  - Learn new patterns if discovered
  - Checkpoint if significant milestone
```

## Code Generation Rules

### 1. Follow Established Patterns
```javascript
// Check patterns/code-style.yaml first
// Example: If user prefers functional components
const Component = ({ prop }) => { ... }  // ✓
class Component extends React.Component { ... }  // ✗
```

### 2. Incremental Complexity
```javascript
// Step 1: Make it work
function getData() {
  return fetch('/api/data').then(r => r.json())
}

// Step 2: Add error handling (later)
function getData() {
  return fetch('/api/data')
    .then(r => r.json())
    .catch(handleError)
}

// Step 3: Add caching (even later)
// ... and so on
```

### 3. Self-Documenting Code
```javascript
// Explain WHY, not WHAT
// ✓ Good: Cache user data to prevent repeated API calls during session
// ✗ Bad: Set userData in cache
```

## Feature Implementation Workflow

```markdown
📋 Starting: [Feature Name]

1️⃣ **Understanding Phase**
   - What problem does this solve?
   - Who will use this feature?
   - What's the simplest solution?

2️⃣ **Planning Phase**
   - Break into small tasks
   - Identify dependencies
   - Check for existing patterns

3️⃣ **Building Phase**
   - Implement core functionality
   - Test happy path
   - Add error handling
   - Implement edge cases

4️⃣ **Review Phase**
   - Self-evaluate against requirements
   - Check code patterns consistency
   - Run mental tests
   - Look for simplifications

5️⃣ **Learning Phase**
   - What patterns emerged?
   - What can be reused?
   - What should we remember?
```

## Progress Communication

Keep user informed with structured updates:

```markdown
🏗️ Building: User Authentication Flow

✓ Completed:
- Basic login form UI
- Form validation
- API integration

🔄 Currently:
- Adding error handling
- Implementing remember me

📝 Discovered:
- Need rate limiting (added to todos)
- Found reusable validation pattern

Next: Loading states and success redirect
```

## Quality Checks

Before considering any feature complete:

- [ ] Works for happy path
- [ ] Handles common errors gracefully
- [ ] Follows project patterns
- [ ] Has appropriate comments
- [ ] Logged in changelog
- [ ] Todos updated
- [ ] Patterns learned

Remember: Every line of code should make the project better and the brain smarter.