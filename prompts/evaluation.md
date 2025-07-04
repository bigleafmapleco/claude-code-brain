# Self-Evaluation Protocol

The ability to critically evaluate and improve work is what separates good code from great code. Use this protocol for continuous improvement.

## The EVALUATE Framework

### E - Examine Against Requirements
```yaml
requirement_check:
  for_each_requirement:
    - Is it fully implemented?
    - Are edge cases handled?
    - Does it match the spec?
    - Is the UX smooth?
```

### V - Validate Code Quality
```yaml
quality_metrics:
  readability:
    - Clear variable names?
    - Logical flow?
    - Appropriate comments?
  
  maintainability:
    - DRY principle followed?
    - Modular structure?
    - Easy to modify?
  
  performance:
    - Efficient algorithms?
    - No unnecessary re-renders?
    - Optimized queries?
  
  security:
    - Input validated?
    - Outputs sanitized?
    - Auth checks in place?
```

### A - Analyze Patterns
```yaml
pattern_analysis:
  consistency:
    - Matches project style?
    - Follows established patterns?
    - Uses known solutions?
  
  improvements:
    - New pattern discovered?
    - Better approach found?
    - Should update brain?
```

### L - Look for Simplification
```yaml
simplification_check:
  - Can this be done with less code?
  - Is there a clearer approach?
  - Are we over-engineering?
  - Can we use existing utilities?
```

### U - Update Implementation
```yaml
if_improvements_found:
  1. Document why current approach is suboptimal
  2. Implement improved version
  3. Test thoroughly
  4. Update patterns if new approach is better
```

### A - Assess Learning
```yaml
learning_assessment:
  - What did we learn?
  - What patterns emerged?
  - What mistakes to avoid?
  - What to do differently next time?
```

### T - Track Progress
```yaml
progress_tracking:
  - Update changelog with evaluation results
  - Mark todos complete or modified
  - Document decisions made
  - Checkpoint if significant
```

### E - Establish Next Steps
```yaml
next_actions:
  - What needs immediate attention?
  - What can be improved later?
  - What new todos emerged?
  - What patterns to implement elsewhere?
```

## Evaluation Triggers

Run evaluation:
- After completing each feature
- Before marking todo complete  
- When something "feels off"
- Before major commits
- After user feedback

## Self-Evaluation Script

```markdown
🔍 Evaluating: [Feature/Component Name]

### Requirements Check:
✓ Requirement 1: Fully implemented
✓ Requirement 2: Implemented with edge cases
⚠️ Requirement 3: Partial - needs error handling
✗ Requirement 4: Not yet implemented

### Code Quality:
- **Readability**: 8/10 (clear but could use better names)
- **Maintainability**: 9/10 (well modularized)
- **Performance**: 7/10 (room for optimization)
- **Security**: 10/10 (all inputs validated)

### Pattern Compliance:
✓ Follows project naming conventions
✓ Uses established error handling
⚠️ Component structure differs slightly

### Improvements Found:
1. Can extract shared validation logic
2. Loading state could be smoother
3. Error messages could be more helpful

### Action Items:
- [ ] Extract validation to utilities
- [ ] Smooth loading transitions
- [ ] Enhance error messaging
- [ ] Update patterns with new approach

Estimated time to improve: 30 minutes

Proceed with improvements? (Y/N)
```

## The Critical Eye Prompt

When deep evaluation is needed:

```markdown
You are now a harsh code reviewer. Your job is to find problems with this implementation:

1. **Security Vulnerabilities**
   - Check every input
   - Review auth logic
   - Look for injections

2. **Performance Issues**
   - Find N+1 queries
   - Spot unnecessary renders
   - Check bundle size impact

3. **UX Frustrations**
   - Identify confusing flows
   - Find missing feedback
   - Spot accessibility issues

4. **Technical Debt**
   - Complex code that could be simple
   - Missing error handling
   - Hardcoded values

5. **Missing Edge Cases**
   - What happens with no data?
   - What about slow connections?
   - How does it fail?

Be brutally honest. Every issue found now saves debugging time later.
```

## Learning from Evaluation

After each evaluation:
1. Update patterns with improvements
2. Document anti-patterns discovered
3. Add common issues to watch for
4. Create reusable solutions
5. Share insights in changelog

Remember: The goal isn't perfection, it's continuous improvement. Every evaluation makes the next implementation better.