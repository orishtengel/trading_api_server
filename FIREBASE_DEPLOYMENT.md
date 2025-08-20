# Firebase Hosting Guide for Trading API Server

This guide explains how to deploy your Express.js trading API server to Firebase Functions.

## Prerequisites

1. **Firebase CLI**: Install globally if not already installed
   ```bash
   npm install -g firebase-tools
   ```
   
   Verify installation:
   ```bash
   firebase --version
   ```

2. **Firebase Project**: You need a Firebase project. If you don't have one:
   ```bash
   firebase login
   firebase projects:list
   # Or create a new project at https://console.firebase.google.com/
   ```

3. **Project Setup**: Initialize Firebase in your project (if not done)
   ```bash
   firebase init
   # Select Functions, Firestore, and Storage when prompted
   ```

## Project Structure

Your project now has the following structure for Firebase hosting:

```
trading_api_server/
├── src/                          # Your main application code
│   ├── shared/app.ts            # Extracted Express app factory
│   └── server.ts                # Local development server
├── functions/                    # Firebase Functions code
│   ├── src/
│   │   ├── index.ts             # Firebase Functions entry point
│   │   └── app.ts               # Re-exports createApp from shared
│   ├── package.json             # Functions dependencies
│   └── tsconfig.json            # Functions TypeScript config
├── dist/                        # Compiled TypeScript (for local dev)
├── firebase.json                # Firebase configuration
└── package.json                # Main project dependencies
```

## Environment Variables

### Local Development
Your `.env` file remains the same for local development.

### Firebase Functions
For production, set environment variables using Firebase CLI:

```bash
# Set individual variables
firebase functions:config:set api.port="8080"
firebase functions:config:set database.url="your-database-url"

# Set from .env file (recommended)
# First, create a functions/.env file with your production values
firebase functions:config:set $(cat functions/.env | xargs)

# View current config
firebase functions:config:get
```

**Important**: Firebase Functions automatically provide `process.env.PORT`, so your app will use that in production.

## Deployment Commands

### 1. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install Functions dependencies
npm run functions:install
```

### 2. Build and Deploy

#### Quick Deploy (Recommended)
```bash
npm run firebase:deploy
```

This command:
1. Builds your main TypeScript project (`npm run build`)
2. Builds the Functions TypeScript code (`npm run functions:build`)  
3. Deploys everything to Firebase (`firebase deploy`)

#### Step-by-Step Deploy
```bash
# Build main project
npm run build

# Build Functions
npm run functions:build

# Deploy only Functions
npm run functions:deploy

# Or deploy everything (Functions + Firestore + Storage rules)
firebase deploy
```

### 3. Local Testing

#### Test Functions Locally
```bash
# Start Firebase emulators (includes Functions on port 5001)
npm run functions:serve

# Your API will be available at:
# http://localhost:5001/YOUR_PROJECT_ID/us-central1/api
```

#### Test Main App Locally
```bash
# Regular development server
npm run dev

# Your API will be available at:
# http://localhost:52700
```

## Accessing Your Deployed API

After deployment, your API will be available at:
```
https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api
```

### API Endpoints
- **API Documentation**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api/api-docs`
- **Auth Routes**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api/auth/*`
- **Bot Routes**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api/user/bots/*`
- **User Routes**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api/users/*`
- **Backtest Routes**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api/user/backtest/*`

## Monitoring and Logs

### View Logs
```bash
# View function logs
npm run functions:logs

# Or use Firebase CLI directly
firebase functions:log

# Real-time logs
firebase functions:log --only api --follow
```

### Firebase Console
Monitor your deployment at:
- **Functions**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/functions
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
- **Usage & Performance**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/usage

## Important Notes

### Cold Starts
- Firebase Functions may have cold start delays (1-3 seconds) for the first request after idle time
- Consider using Firebase Functions (2nd gen) for better performance if needed

### Timeout and Memory
- Default timeout: 60 seconds
- Default memory: 256MB
- Configure in `functions/src/index.ts` if needed:

```typescript
export const api = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .https.onRequest(app);
```

### CORS
Your CORS configuration in `@shared/http/cors` will work automatically.

### Database Connections
If using databases:
- Use connection pooling appropriately for serverless environment
- Consider Firebase Firestore for optimal integration
- For external databases, use connection limits suitable for serverless

## Troubleshooting

### Build Errors
If you get TypeScript build errors:
```bash
# Clean build
rm -rf dist functions/lib
npm run build
npm run functions:build
```

### Import Path Issues
The project uses path aliases (`@controller/*`, `@manager/*`, etc.). These are configured in:
- Main project: `tsconfig.json`
- Functions: `functions/tsconfig.json`

### Permission Errors
Ensure your Firebase project has the necessary APIs enabled:
- Cloud Functions API
- Cloud Build API (for deployment)
- Firestore API (if using Firestore)

### Environment Variables Not Working
```bash
# Check current config
firebase functions:config:get

# Re-deploy after config changes
firebase deploy --only functions
```

## Cost Optimization

### Free Tier Limits
- 2M invocations/month
- 400,000 GB-seconds/month
- 200,000 CPU-seconds/month

### Optimization Tips
- Minimize cold starts by keeping functions warm (scheduled functions)
- Use appropriate memory allocation
- Optimize your Express app startup time
- Consider caching strategies

## Next Steps

1. **Set up CI/CD**: Consider GitHub Actions or similar for automated deployment
2. **Monitoring**: Set up alerts for errors and performance in Firebase Console
3. **Security**: Review and update Firestore rules, implement proper authentication
4. **Performance**: Monitor function performance and optimize as needed

## Support

- **Firebase Documentation**: https://firebase.google.com/docs/functions
- **Firebase Support**: https://firebase.google.com/support
- **Community**: https://stackoverflow.com/questions/tagged/firebase-functions
