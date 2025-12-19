# MCP Integration Guide

**Version:** 1.3.0
**Purpose:** How to use bundled MCP servers and create your own

---

## What is MCP?

**MCP (Model Context Protocol)** is an open protocol by Anthropic that lets AI models connect to external tools and services.

```
User Message → Claude → MCP Server → External Service
                  ↑                        ↓
                  ←←←←←← Response ←←←←←←←←←
```

**Key Benefit:** Claude can automatically use MCP tools based on context - no explicit invocation needed.

---

## Bundled MCP Servers

Aura Frog bundles 6 MCP servers in `.mcp.json`:

```toon
servers[6]{name,package,purpose}:
  context7,@upstash/context7-mcp,Library docs (MUI Tailwind React etc)
  playwright,@playwright/mcp,Browser automation + E2E testing
  vitest,@djankies/vitest-mcp,Test execution + coverage
  atlassian,@anthropic/atlassian-mcp,JIRA + Confluence
  figma,@anthropic/figma-mcp,Design file fetching
  slack,@anthropic/slack-mcp,Notifications
```

---

## How They Auto-Invoke

Claude detects context and uses appropriate MCP:

| User Says | MCP Used | What Happens |
|-----------|----------|--------------|
| "Build with Material UI" | context7 | Fetches MUI docs |
| "Test the login page" | playwright | Opens browser, runs E2E |
| "Run unit tests" | vitest | Executes tests, shows results |
| "Check PROJ-1234" | atlassian | Fetches JIRA ticket |
| "Get the Figma design" | figma | Fetches design tokens |
| "Notify the team" | slack | Sends message |

**No explicit command needed** - Claude uses them automatically.

---

## Setup Requirements

### Environment Variables

Create `.envrc` in your project root:

```bash
# Atlassian (JIRA + Confluence)
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"
export CONFLUENCE_URL="https://company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your-email@company.com"
export CONFLUENCE_API_TOKEN="your-api-token"

# Figma
export FIGMA_API_TOKEN="your-figma-token"

# Slack
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_CHANNEL_ID="C0123456789"
```

### How to Get Tokens

| Service | Token URL |
|---------|-----------|
| JIRA/Confluence | https://id.atlassian.com/manage-profile/security/api-tokens |
| Figma | https://www.figma.com/developers/api#access-tokens |
| Slack | https://api.slack.com/apps → OAuth & Permissions |

---

## MCP vs Skills vs Agents

| Component | Purpose | When Used |
|-----------|---------|-----------|
| **MCP** | External service integration | Fetch data, run tools |
| **Skills** | Code patterns + best practices | Generate code |
| **Agents** | Task execution roles | Complex workflows |

**Example Flow:**
```
1. User: "Implement PROJ-123 from Figma"
2. MCP atlassian → fetches JIRA ticket requirements
3. MCP figma → fetches design tokens and components
4. Skill react-expert → applies React patterns
5. Agent web-expert → executes implementation
```

---

## Creating Your Own MCP Server

### When to Create Custom MCP

- Your company's internal APIs
- Custom tooling not available elsewhere
- Specialized data sources

### Quick Start (TypeScript)

**1. Initialize project:**
```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
```

**2. Create `src/index.ts`:**
```typescript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "my-custom-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define your tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "my_tool",
      description: "Description of what this tool does",
      inputSchema: {
        type: "object",
        properties: {
          param1: { type: "string", description: "First parameter" },
        },
        required: ["param1"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "my_tool") {
    const { param1 } = request.params.arguments as { param1: string };

    // Your logic here
    const result = await doSomething(param1);

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function doSomething(param: string) {
  // Your implementation
  return { success: true, data: param };
}

// Start server
const transport = new StdioServerTransport();
server.connect(transport);
```

**3. Create `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

**4. Update `package.json`:**
```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-mcp-server": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

**5. Build and test:**
```bash
npm run build
```

### Adding to Aura Frog

Add your MCP to `.mcp.json`:

```json
{
  "mcpServers": {
    "my-custom": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"],
      "env": {
        "MY_API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

Or if published to npm:
```json
{
  "mcpServers": {
    "my-custom": {
      "command": "npx",
      "args": ["-y", "@myorg/my-mcp-server"]
    }
  }
}
```

---

## MCP Tool Patterns

### Fetching External Data

```typescript
{
  name: "fetch_user",
  description: "Fetch user by ID from API",
  inputSchema: {
    type: "object",
    properties: {
      userId: { type: "string" }
    },
    required: ["userId"]
  }
}

// Handler
const response = await fetch(`${API_URL}/users/${userId}`);
return { content: [{ type: "text", text: JSON.stringify(await response.json()) }] };
```

### Running Commands

```typescript
{
  name: "run_tests",
  description: "Run test suite",
  inputSchema: {
    type: "object",
    properties: {
      pattern: { type: "string", description: "Test file pattern" }
    }
  }
}

// Handler
import { exec } from "child_process";
const output = await new Promise((resolve, reject) => {
  exec(`npm test -- ${pattern}`, (error, stdout, stderr) => {
    resolve({ stdout, stderr, error: error?.message });
  });
});
```

### Database Queries

```typescript
{
  name: "query_db",
  description: "Query database",
  inputSchema: {
    type: "object",
    properties: {
      sql: { type: "string" }
    },
    required: ["sql"]
  }
}

// Handler - with safety checks!
if (sql.toLowerCase().includes("drop") || sql.toLowerCase().includes("delete")) {
  throw new Error("Destructive queries not allowed");
}
const results = await db.query(sql);
```

---

## Testing Your MCP

### Using MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Opens a web UI to test your MCP tools interactively.

### In Claude Code

```bash
# Restart Claude Code after adding to .mcp.json
claude

# Test your tool
> Use my_tool with param1="test"
```

---

## Best Practices

### Security

```typescript
// ✅ Validate inputs
const schema = z.object({
  userId: z.string().uuid(),
});
const { userId } = schema.parse(request.params.arguments);

// ✅ Sanitize outputs
const sanitized = JSON.stringify(result).replace(/password/gi, "[REDACTED]");

// ✅ Use environment variables for secrets
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error("API_KEY not configured");
```

### Error Handling

```typescript
try {
  const result = await riskyOperation();
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
} catch (error) {
  return {
    content: [{ type: "text", text: `Error: ${error.message}` }],
    isError: true,
  };
}
```

### Performance

```typescript
// ✅ Cache expensive operations
const cache = new Map();

async function getCachedData(key: string) {
  if (cache.has(key)) return cache.get(key);
  const data = await fetchExpensiveData(key);
  cache.set(key, data);
  return data;
}
```

---

## Resources

- [MCP Official Docs](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Example MCP Servers](https://github.com/modelcontextprotocol/servers)

---

**Version:** 1.3.0 | **Last Updated:** 2025-12-19
