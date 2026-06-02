# Oikos-AI Integration Guide

This guide covers integrating external services and APIs with Oikos-AI.

## 🤖 AI Provider Integration

### OpenAI

**Setup:**
```env
OPENAI_API_KEY=sk_test_...
```

**Usage:**
```typescript
const aiService = new AIService();
const response = await aiService.callOpenAI([
  { role: 'user', content: 'Your prompt' }
], 'gpt-4');
```

**Supported Models:**
- `gpt-4` - Most capable
- `gpt-3.5-turbo` - Fast and cost-effective
- `text-embedding-3-small` - Embeddings

### Google Gemini

**Setup:**
```env
GEMINI_API_KEY=your_gemini_key
```

**Usage:**
```typescript
const response = await aiService.callGemini(
  'Your prompt',
  'gemini-pro'
);
```

**Supported Models:**
- `gemini-pro` - Text generation
- `gemini-pro-vision` - Image understanding

### Anthropic Claude

**Setup:**
```env
ANTHROPIC_API_KEY=your_anthropic_key
```

**Features:**
- Long context window (100K tokens)
- Constitutional AI training
- High performance on reasoning tasks

## 💾 Database Integration

### PostgreSQL

**Connection:**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

**Schema Creation:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  passwordHash VARCHAR NOT NULL,
  name VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Vector Database (for embeddings)

**Pinecone Integration:**
```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const index = pc.Index('oikos-ai');
await index.upsert([{
  id: 'doc-1',
  values: embedding,
  metadata: { source: 'blueprint' }
}]);
```

## 🔐 Authentication Services

### JWT Configuration

```typescript
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### OAuth2 (Google, GitHub)

```typescript
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URL
);
```

## 📤 File Storage

### AWS S3

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

await s3.send(new PutObjectCommand({
  Bucket: process.env.S3_BUCKET,
  Key: `uploads/${filename}`,
  Body: fileContent,
}));
```

## 📧 Email Service

### SendGrid

```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: user.email,
  from: 'noreply@oikos-ai.com',
  subject: 'Welcome to Oikos-AI',
  text: 'Your application is ready!',
});
```

## 📊 Analytics

### Mixpanel

```typescript
import Mixpanel from 'mixpanel';

const mp = Mixpanel.init(process.env.MIXPANEL_TOKEN);

mp.track('app_generated', {
  appName: 'todo-app',
  agentCount: 7,
  buildTime: 120
});
```

## 🔔 Push Notifications

### Firebase Cloud Messaging

```typescript
import admin from 'firebase-admin';

admin.initializeApp();

await admin.messaging().send({
  token: deviceToken,
  notification: {
    title: 'App Generated',
    body: 'Your application is ready to deploy!'
  }
});
```

## 🚀 Deployment Integrations

### GitHub Actions

```yaml
name: Deploy Oikos-AI
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run deploy
```

### Vercel (Frontend)

```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url"
  }
}
```

### Heroku (Backend)

```bash
# Procfile
web: npm run start
```

## 🔄 Webhook Configuration

```typescript
// Receive webhooks
app.post('/webhooks/deployment', (req, res) => {
  const event = req.body;
  
  switch(event.type) {
    case 'deployment.started':
      handleDeploymentStarted(event);
      break;
    case 'deployment.completed':
      handleDeploymentCompleted(event);
      break;
  }
  
  res.json({ received: true });
});
```

## 📋 Environment Setup Checklist

- [ ] OpenAI API key obtained
- [ ] PostgreSQL database created
- [ ] JWT secret generated
- [ ] AWS/GCP credentials configured
- [ ] SendGrid API key obtained
- [ ] Firebase initialized
- [ ] GitHub OAuth app created
- [ ] Deployment platform configured
- [ ] Monitoring/logging service setup
- [ ] All .env variables populated

## 🆘 Common Issues

### API Rate Limiting
```typescript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

### Connection Pooling
```typescript
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 📚 Additional Resources

- [OpenAI Documentation](https://platform.openai.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [AWS SDK](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Last Updated**: 2026-06-02
