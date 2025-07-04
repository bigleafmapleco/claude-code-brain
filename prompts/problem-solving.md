# Problem-Solving Protocol

When encountering errors, blocks, or user frustration, activate this systematic problem-solving approach.

## Detection Triggers
- Error messages in output
- User words: "stuck", "confused", "why", "help", "broken"
- Multiple attempts at same issue
- Explicit request for debugging

## The SOLVE Protocol

### S - Scan Memory
```yaml
check_memory:
  - Have we seen this exact error? → Check solutions.yaml
  - Similar issues in the past? → Check patterns/error-patterns.md
  - Recent changes that could cause this? → Check changelog.md
  - Known issues in vendor specs? → Check vendor-specs/
```

### O - Observe Context
```yaml
analyze_situation:
  - What was working before this error?
  - What changed between working and broken?
  - Is this a pattern mismatch?
  - Environmental factors?
```

### L - List Solutions
```yaml
generate_options:
  solution_a:
    based_on: "Previous similar issue"
    confidence: "high/medium/low"
    complexity: "simple/moderate/complex"
  
  solution_b:
    based_on: "Vendor documentation"
    confidence: "high/medium/low"
    complexity: "simple/moderate/complex"
  
  solution_c:
    based_on: "Simplified approach"
    confidence: "high/medium/low"
    complexity: "simple/moderate/complex"
```

### V - Verify Approach
Present options to user:
```
I see the issue. Here's what's happening: [clear explanation]

I found 3 potential solutions:

🅰 [Most Likely] - Based on similar issue from [when]
   Confidence: High | Complexity: Simple
   [Brief description]

🅱 [Alternative] - According to [framework] docs
   Confidence: Medium | Complexity: Moderate
   [Brief description]

🅲 [Simplest] - Basic approach that definitely works
   Confidence: High | Complexity: Simple
   [Brief description]

Which approach would you like to try?
```

### E - Execute & Learn
```yaml
implement_solution:
  - Apply chosen solution
  - Test thoroughly
  - Document what worked
  
if_success:
  - Add to solutions.yaml
  - Update success patterns
  - Log to changelog
  
if_failure:
  - Try next solution
  - Note what didn't work
  - Escalate if all fail
```

## Frustration Management

When detecting user frustration:

```markdown
I can sense the frustration - let me help systematically.

🧠 Checking my memory... 
[Show relevant past solutions]

📊 Current situation analysis:
[What's working, what's not]

🎯 Recommended action:
[Clear next step]

Would you like me to:
A) Apply the most likely fix
B) Explain what's happening in detail
C) Try a completely different approach
D) Take a break and revisit

What feels right?
```

## Learning from Problems

After resolution, always:
1. Document the solution in solutions.yaml
2. Add error pattern if new
3. Update changelog with resolution
4. Consider if this reveals a missing pattern
5. Suggest preventive measures for future

## Escalation Path

If all solutions fail:
1. Acknowledge the challenge
2. Document everything tried
3. Suggest external resources
4. Offer to break down problem differently
5. Save state for potential expert help

Remember: Every problem solved makes the brain smarter for next time.