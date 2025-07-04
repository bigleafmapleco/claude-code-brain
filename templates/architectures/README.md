# Architecture Templates

This directory contains pre-configured project architectures that Claude Code Brain can use to quickly scaffold new projects with proven tech stack combinations.

## Purpose

Architecture templates provide:
- Pre-selected, compatible tech stacks
- Initial project configuration
- Best practice folder structures
- Common dependencies
- Boilerplate setup code

## Directory Structure

```
templates/architectures/
├── nextjs-supabase/
│   ├── config.yaml          # Architecture configuration
│   ├── dependencies.json    # NPM dependencies to install
│   ├── structure.yaml       # Folder structure to create
│   ├── env.template        # Environment variables template
│   └── files/              # Boilerplate files to copy
│       ├── src/
│       └── ...
├── react-express/
│   └── ...
└── vue-firebase/
    └── ...
```

## Architecture Configuration Format

Each architecture needs a `config.yaml`:

```yaml
name: "Next.js + Supabase + Clerk"
version: "1.0.0"
description: "Production-ready SaaS starter with auth and database"
author: "Claude Code Brain"

tech_stack:
  frontend:
    framework: "Next.js 14"
    routing: "App Router"
    styling: "Tailwind CSS"
    components: "shadcn/ui"
  
  backend:
    api: "Next.js API Routes"
    orm: "Prisma"
  
  database:
    provider: "Supabase"
    type: "PostgreSQL"
  
  auth:
    provider: "Clerk"
    features: ["email", "oauth", "magic-links"]
  
  deployment:
    platform: "Vercel"
    features: ["edge-functions", "analytics"]

features:
  - "Type-safe API with tRPC"
  - "Real-time subscriptions"
  - "Role-based access control"
  - "Stripe payment integration ready"

complexity: "intermediate" # beginner | intermediate | advanced

tags: ["saas", "full-stack", "production-ready"]
```

## Dependencies Format

`dependencies.json`:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@clerk/nextjs": "^4.27.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "prisma": "^5.7.0"
  }
}
```

## Structure Format

`structure.yaml`:

```yaml
directories:
  - src/
  - src/app/
  - src/app/api/
  - src/app/(auth)/
  - src/app/(dashboard)/
  - src/components/
  - src/components/ui/
  - src/lib/
  - src/lib/db/
  - src/hooks/
  - src/types/
  - public/
  - prisma/

files:
  - path: "src/lib/supabase.ts"
    template: "supabase-client.ts"
  - path: "src/middleware.ts"
    template: "clerk-middleware.ts"
  - path: ".env.example"
    template: "env.template"
```

## Example Usage

When a user runs:
```bash
claude-code-brain init --template nextjs-supabase
```

The framework would:
1. Load the architecture configuration
2. Create the directory structure
3. Copy boilerplate files
4. Install dependencies
5. Generate `.env` file from template
6. Update `.claude/memory/context.yaml` with tech stack

## Creating New Architecture Templates

To add a new architecture:

1. Create a new directory: `templates/architectures/your-stack-name/`
2. Add required files:
   - `config.yaml` - Architecture metadata
   - `dependencies.json` - NPM packages
   - `structure.yaml` - Directory structure
   - `env.template` - Environment variables
   - `files/` - Boilerplate code

3. Test the template:
   ```bash
   claude-code-brain init --template your-stack-name
   ```

## Best Practices

1. **Keep it minimal**: Include only essential boilerplate
2. **Document choices**: Explain why certain libraries were chosen
3. **Version lock**: Use specific versions for stability
4. **Include examples**: Add example components/routes
5. **Environment template**: Always include `.env.example`

## Future Enhancements

- [ ] Template validation script
- [ ] Template generator CLI
- [ ] Community template registry
- [ ] Version management for templates
- [ ] Upgrade paths between versions