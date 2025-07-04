const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const yaml = require('yaml');

class VendorSpecManager {
  constructor() {
    this.specsPath = '.claude/vendor-specs';
    this.manifestPath = path.join(this.specsPath, 'manifest.yaml');
    this.sources = {};
  }

  async initialize() {
    try {
      // Ensure directory exists
      await fs.mkdir(this.specsPath, { recursive: true });
      
      // Load or create manifest
      await this.loadManifest();
      
      console.log('📚 Vendor spec manager initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize vendor specs:', error.message);
      return false;
    }
  }

  async loadManifest() {
    try {
      const content = await fs.readFile(this.manifestPath, 'utf8');
      const manifest = yaml.parse(content);
      this.sources = manifest.sources || {};
    } catch (error) {
      // Create default manifest
      const defaultManifest = {
        version: '1.0',
        sources: {
          'nextjs': {
            name: 'Next.js',
            docUrl: 'https://nextjs.org/docs',
            enabled: true,
            lastUpdated: null
          },
          'react': {
            name: 'React',
            docUrl: 'https://react.dev/reference/react',
            enabled: true,
            lastUpdated: null
          },
          'supabase': {
            name: 'Supabase',
            docUrl: 'https://supabase.com/docs',
            enabled: true,
            lastUpdated: null
          },
          'tailwind': {
            name: 'Tailwind CSS',
            docUrl: 'https://tailwindcss.com/docs',
            enabled: true,
            lastUpdated: null
          }
        }
      };
      
      this.sources = defaultManifest.sources;
      await this.saveManifest(defaultManifest);
    }
  }

  async saveManifest(manifest = null) {
    const data = manifest || {
      version: '1.0',
      sources: this.sources,
      lastSync: new Date().toISOString()
    };
    
    await fs.writeFile(this.manifestPath, yaml.stringify(data, null, 2));
  }

  async detectProjectStack() {
    console.log('🔍 Detecting project tech stack...');
    
    const detectedTech = {
      dependencies: {},
      devDependencies: {},
      detected: []
    };
    
    try {
      // Check package.json
      const packagePath = 'package.json';
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageData = JSON.parse(packageContent);
      
      detectedTech.dependencies = packageData.dependencies || {};
      detectedTech.devDependencies = packageData.devDependencies || {};
      
      // Detect common frameworks
      if (detectedTech.dependencies['next'] || detectedTech.devDependencies['next']) {
        detectedTech.detected.push('nextjs');
      }
      if (detectedTech.dependencies['react'] || detectedTech.devDependencies['react']) {
        detectedTech.detected.push('react');
      }
      if (detectedTech.dependencies['@supabase/supabase-js']) {
        detectedTech.detected.push('supabase');
      }
      if (detectedTech.devDependencies['tailwindcss']) {
        detectedTech.detected.push('tailwind');
      }
      if (detectedTech.dependencies['@clerk/nextjs']) {
        detectedTech.detected.push('clerk');
      }
      
      console.log('✓ Detected:', detectedTech.detected.join(', '));
      
      // Enable detected sources
      for (const tech of detectedTech.detected) {
        if (this.sources[tech]) {
          this.sources[tech].enabled = true;
          this.sources[tech].detected = true;
        }
      }
      
      await this.saveManifest();
      
    } catch (error) {
      console.log('No package.json found, using defaults');
    }
    
    return detectedTech;
  }

  async syncAll() {
    console.log('\n🔄 Syncing vendor specifications...\n');
    
    const results = {
      success: [],
      failed: []
    };
    
    for (const [key, source] of Object.entries(this.sources)) {
      if (!source.enabled) continue;
      
      console.log(`📖 Syncing ${source.name}...`);
      
      try {
        const spec = await this.generateSpec(key, source);
        await this.saveSpec(key, spec);
        
        // Update manifest
        this.sources[key].lastUpdated = new Date().toISOString();
        
        results.success.push(key);
        console.log(`✓ ${source.name} spec updated`);
      } catch (error) {
        results.failed.push({ key, error: error.message });
        console.error(`✗ Failed to sync ${source.name}:`, error.message);
      }
    }
    
    await this.saveManifest();
    
    console.log('\n📊 Sync Summary:');
    console.log(`✓ Success: ${results.success.length}`);
    console.log(`✗ Failed: ${results.failed.length}`);
    
    return results;
  }

  async generateSpec(key, source) {
    // In a real implementation, this would fetch and parse actual docs
    // For now, we'll create structured templates
    
    const specs = {
      nextjs: {
        version: '14.0',
        lastChecked: new Date().toISOString(),
        keyPatterns: {
          appRouter: {
            description: 'App Router is the recommended approach',
            example: 'app/page.tsx for routes',
            bestPractices: [
              'Use server components by default',
              'Client components need "use client" directive',
              'Loading.tsx for loading states',
              'Error.tsx for error boundaries'
            ]
          },
          dataFetching: {
            description: 'Server Components fetch data directly',
            example: 'async function Page() { const data = await fetch(...) }',
            bestPractices: [
              'Fetch in Server Components when possible',
              'Use cache() for request deduplication',
              'Implement proper error handling'
            ]
          },
          routing: {
            description: 'File-based routing in app directory',
            patterns: [
              'app/page.tsx → /',
              'app/about/page.tsx → /about',
              'app/blog/[slug]/page.tsx → /blog/:slug',
              'app/(group)/layout.tsx → Layout for group'
            ]
          }
        },
        commonIssues: {
          'Module not found': 'Check if using correct import paths for app router',
          'Hydration mismatch': 'Ensure consistent server/client rendering'
        }
      },
      react: {
        version: '18.2',
        lastChecked: new Date().toISOString(),
        keyPatterns: {
          hooks: {
            description: 'Hooks are the modern way to use state and effects',
            commonHooks: [
              'useState: Local component state',
              'useEffect: Side effects',
              'useContext: Consume context',
              'useMemo: Expensive computations',
              'useCallback: Memoize callbacks'
            ]
          },
          components: {
            description: 'Function components are recommended',
            example: 'function Component({ prop }: Props) { return <div>{prop}</div> }',
            bestPractices: [
              'Use TypeScript for props',
              'Destructure props',
              'Keep components focused',
              'Extract custom hooks'
            ]
          }
        }
      },
      supabase: {
        version: '2.0',
        lastChecked: new Date().toISOString(),
        keyPatterns: {
          client: {
            description: 'Initialize Supabase client',
            example: `import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, anonKey)`,
            bestPractices: [
              'Use environment variables for keys',
              'Create singleton client',
              'Handle auth state changes'
            ]
          },
          database: {
            description: 'Postgres database operations',
            examples: {
              select: "await supabase.from('table').select('*')",
              insert: "await supabase.from('table').insert({ data })",
              update: "await supabase.from('table').update({ data }).eq('id', id)",
              delete: "await supabase.from('table').delete().eq('id', id)"
            }
          },
          auth: {
            description: 'Built-in authentication',
            examples: {
              signUp: "await supabase.auth.signUp({ email, password })",
              signIn: "await supabase.auth.signInWithPassword({ email, password })",
              signOut: "await supabase.auth.signOut()"
            }
          }
        }
      },
      tailwind: {
        version: '3.3',
        lastChecked: new Date().toISOString(),
        keyPatterns: {
          utilities: {
            description: 'Utility-first CSS framework',
            common: [
              'flex, grid: Layout',
              'p-4, m-2: Spacing',
              'text-lg, font-bold: Typography',
              'bg-blue-500, text-white: Colors',
              'hover:, focus:: State variants'
            ]
          },
          responsive: {
            description: 'Mobile-first responsive design',
            breakpoints: {
              'sm': '640px',
              'md': '768px', 
              'lg': '1024px',
              'xl': '1280px',
              '2xl': '1536px'
            },
            example: 'class="text-sm md:text-lg lg:text-xl"'
          }
        }
      }
    };
    
    return specs[key] || {
      version: 'unknown',
      lastChecked: new Date().toISOString(),
      message: 'Spec not available yet'
    };
  }

  async saveSpec(key, spec) {
    const specPath = path.join(this.specsPath, `${key}-spec.yaml`);
    await fs.writeFile(specPath, yaml.stringify(spec, null, 2));
  }

  async getSpec(key) {
    try {
      const specPath = path.join(this.specsPath, `${key}-spec.yaml`);
      const content = await fs.readFile(specPath, 'utf8');
      return yaml.parse(content);
    } catch (error) {
      return null;
    }
  }

  async checkForUpdates() {
    const needsUpdate = [];
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds
    
    for (const [key, source] of Object.entries(this.sources)) {
      if (!source.enabled) continue;
      
      if (!source.lastUpdated) {
        needsUpdate.push(key);
      } else {
        const lastUpdate = new Date(source.lastUpdated);
        const now = new Date();
        
        if (now - lastUpdate > oneDay) {
          needsUpdate.push(key);
        }
      }
    }
    
    return needsUpdate;
  }
}

module.exports = VendorSpecManager;