# Oikos-AI Setup Guide

Complete setup instructions for getting Oikos-AI up and running.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn 4.0.0+)
- **PostgreSQL** 14+ (for backend)
- **Git** for version control
- API keys from at least one AI provider (OpenAI recommended)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/scottholdan-ui/Oikos-AI.git
cd Oikos-AI
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# AI Provider Keys
OPENAI_API_KEY=sk_test_...
GEMINI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oikos_ai
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-min-32-chars-long
```

### 4. Set Up PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE oikos_ai;

# Create user (optional)
CREATE USER oikos_user WITH PASSWORD 'your_password';
ALTER ROLE oikos_user WITH CREATEDB;
```

### 5. Build TypeScript

```bash
npm run build
```

### 6. Run the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run start
```

## 🚀 Getting Started Examples

### Example 1: Build a Simple App

```bash
# Start the application
npm run dev

# When prompted, enter:
"Build a todo list application with user authentication and task categories"
```

Expected output:
```
🚀 Starting application build process...
Stage 1/7: Architect Agent analyzing requirements...
✅ Architecture completed
Stage 2/7: UI/UX Agent designing interface...
✅ UI/UX Design completed
...
✅ Application build completed successfully!
```

### Example 2: Use Individual Agents

Create a file `example.ts`:

```typescript
import { ArchitectAgent } from './core/agents/architect-agent';

async function example() {
  const architect = new ArchitectAgent();
  
  const result = await architect.execute(
    'Build an e-commerce platform with AI recommendations'
  );
  
  console.log(JSON.stringify(result, null, 2));
}

example().catch(console.error);
```

Run it:
```bash
npx ts-node example.ts
```

## 📦 Project Structure After Setup

```
Oikos-AI/
├── core/
│   ├── agents/
│   │   ├── base-agent.ts
│   │   ├── architect-agent.ts
│   │   ├── ui-ux-agent.ts
│   │   ├── frontend-agent.ts
│   │   ├── backend-agent.ts
│   │   └── ai-agent.ts
│   └── orchestrator.ts
├── dist/                    # Compiled JavaScript
├── node_modules/           # Dependencies
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 API Keys Setup

### OpenAI

1. Visit [OpenAI API](https://platform.openai.com/api-keys)
2. Create new API key
3. Add to `.env`: `OPENAI_API_KEY=sk_test_...`

### Google Gemini

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add to `.env`: `GEMINI_API_KEY=...`

### Anthropic Claude

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create new API key
3. Add to `.env`: `ANTHROPIC_API_KEY=...`

## 🧪 Verification

### Verify Installation

```bash
# Check Node version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 9+

# Check TypeScript
npx tsc --version

# Check dependencies installed
npm list --depth=0
```

### Run a Quick Test

```bash
# Build the project
npm run build

# Run type checking
npm run type-check

# List compiled files
ls -la dist/
```

## 🆘 Troubleshooting

### Issue: "Cannot find module 'typescript'"

```bash
npm install typescript --save-dev
npm run build
```

### Issue: "API key is invalid"

1. Verify the API key is correct
2. Check environment variable is properly set
3. Ensure `.env` file is in root directory

### Issue: "Database connection failed"

```bash
# Test PostgreSQL connection
psql -U postgres -h localhost

# Check if database exists
psql -U postgres -c "SELECT datname FROM pg_database;"
```

### Issue: Build fails with TypeScript errors

```bash
# Check for type errors
npm run type-check

# View detailed errors
npm run build
```

## 📚 Next Steps

1. **Explore Individual Agents**: See how each agent works
2. **Read the API Documentation**: Understand the API structure
3. **Try Example Workflows**: Run provided examples
4. **Build Your First App**: Use the orchestrator to build an app
5. **Integrate Custom Agents**: Extend with your own agents

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Run in development mode
npm run build           # Build TypeScript
npm run type-check      # Check for type errors

# Testing
npm test                # Run all tests
npm test -- --coverage  # With coverage report

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code

# Production
npm run build           # Build for production
npm run start           # Start production server
```

## 📖 Additional Resources

- [Main README](./README.md)
- [Agent Architecture](./docs/agent-patterns.md) (if available)
- [API Reference](./docs/api.md) (if available)
- [Integration Guide](./docs/integrations.md) (if available)

## 🤝 Getting Help

- Check existing issues: https://github.com/scottholdan-ui/Oikos-AI/issues
- Create a new issue with detailed information
- Review troubleshooting section above
- Check documentation files

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] PostgreSQL database created
- [ ] API keys added to `.env`
- [ ] Project builds successfully (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Ready to run (`npm run dev`)

---

**Setup complete!** You're ready to start building intelligent applications with Oikos-AI. 🚀
