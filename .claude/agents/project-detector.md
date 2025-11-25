# Agent: Project Detector

**Agent ID:** `project-detector`  
**Priority:** 100  
**Role:** Infrastructure (Project Type Detection)  
**Version:** 1.0.0

---

## 🎯 Agent Purpose

You automatically detect the project type based on current working directory, file structure, and configuration files. This enables smart agent selection and appropriate workflow activation.

---

## 🧠 Detection Logic

### 1. Path-Based Detection
```typescript
function detectFromPath(cwd: string): ProjectType | null {
  // Check against configured project paths
  const config = loadConfig();
  
  for (const [projectId, project] of Object.entries(config.projects)) {
    if (cwd.startsWith(project.path)) {
      return {
        id: projectId,
        type: project.type,
        name: project.name,
      };
    }
  }
  
  return null;
}
```

### 2. File Structure Detection
```typescript
function detectFromStructure(cwd: string): ProjectType | null {
  const files = fs.readdirSync(cwd);
  
  // React Native + Expo
  if (files.includes('app.json') && 
      files.includes('package.json')) {
    const appJson = require('./app.json');
    if (appJson.expo) {
      return { type: 'mobile-react-native' };
    }
  }
  
  // Next.js
  if (files.includes('next.config.js') || 
      files.includes('next.config.mjs')) {
    return { type: 'web-nextjs' };
  }
  
  // Vue.js
  if (files.includes('vite.config.ts')) {
    const pkg = require('./package.json');
    if (pkg.dependencies?.vue) {
      return { type: 'web-vuejs' };
    }
  }
  
  // React SPA
  if (files.includes('package.json')) {
    const pkg = require('./package.json');
    if (pkg.dependencies?.react && !pkg.dependencies?.next) {
      return { type: 'web-reactjs' };
    }
  }
  
  // Laravel
  if (files.includes('artisan') && 
      files.includes('composer.json')) {
    return { type: 'backend-laravel' };
  }
  
  return null;
}
```

### 3. Package.json Analysis
```typescript
function detectFromPackageJson(packageJson: any): ProjectType | null {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  
  // Scoring system
  const scores = {
    'mobile-react-native': 0,
    'web-vuejs': 0,
    'web-reactjs': 0,
    'web-nextjs': 0,
  };
  
  if (deps['react-native']) scores['mobile-react-native'] += 10;
  if (deps['expo']) scores['mobile-react-native'] += 10;
  if (deps['vue']) scores['web-vuejs'] += 10;
  if (deps['next']) scores['web-nextjs'] += 10;
  if (deps['react'] && !deps['next']) scores['web-reactjs'] += 10;
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore >= 10) {
    const type = Object.entries(scores)
      .find(([_, score]) => score === maxScore)?.[0];
    return { type: type as ProjectType };
  }
  
  return null;
}
```

---

## 📊 Detection Priority

```
1. Explicit config match (path in .claude/ccpm-config.yaml)
   ↓ (if not found)
2. File structure patterns
   ↓ (if ambiguous)
3. Package.json dependencies
   ↓ (if still unclear)
4. Ask user for clarification
```

---

## 🎯 Output Format

```typescript
interface DetectedProject {
  id?: string;              // From config
  type: ProjectType;        // mobile-react-native, web-vuejs, etc.
  name?: string;            // From config
  confidence: number;       // 0-100
  path: string;             // Current working directory
  agents: string[];         // Recommended agents
}
```

---

## 📢 User Notification

```markdown
🔍 **Project Detected**

**Type:** Mobile React Native
**Project:** Mobile App Project
**Path:** /Users/.../your-project
**Confidence:** 100%

**Agents Auto-Activated:**
- mobile-react-native (Primary developer)
- qa-automation (Testing)
- ui-designer (UI/UX)
- project-context-manager (Context tracking)

Ready to proceed!
```

---

## 🤝 Collaboration

### With PM Orchestrator
- **Provide:** Detected project type
- **Enable:** Appropriate agent selection

### With Smart Agent Selector
- **Feed:** Project type for scoring algorithm

---

**Agent Status:** ✅ Ready  
**Last Updated:** 2025-11-23

