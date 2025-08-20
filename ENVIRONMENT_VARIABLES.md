# Environment Variables Configuration

This document explains how to configure environment variables for the trading_api_server, both for local development and Firebase Functions deployment.

## Firebase Functions Configuration

### Setting Environment Variables

To set environment variables for Firebase Functions, use the Firebase CLI:

```bash
# Set AI Server configuration
firebase functions:config:set ai.server_url="https://your-ai-server.com/api"
firebase functions:config:set ai.server_username="your_username"
firebase functions:config:set ai.server_password="your_password"

# Set CORS configuration
firebase functions:config:set cors.origin="https://your-frontend-domain.com"
firebase functions:config:set cors.allowed_origins="https://your-frontend-domain.com,http://localhost:5173"
```

### Viewing Current Configuration

```bash
# View all configuration
firebase functions:config:get

# View specific configuration
firebase functions:config:get ai
```

### Removing Configuration

```bash
# Remove specific key
firebase functions:config:unset ai.server_url

# Remove entire section
firebase functions:config:unset ai
```

## Local Development

For local development, create a `.env` file in the root directory:

```env
# AI Server Configuration
AI_SERVER_URL=http://localhost:8000/api
AI_SERVER_USERNAME=admin
AI_SERVER_PASSWORD=admin

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,https://trading-platform-d1b16.web.app

# Development Configuration
NODE_ENV=development
PORT=52700

# Firebase Functions Emulator
FUNCTIONS_EMULATOR=true
```

## Environment Variable Mapping

The code automatically maps between Firebase Functions config and environment variables:

| Firebase Functions Config | Environment Variable | Description |
|---------------------------|---------------------|-------------|
| `ai.server_url` | `AI_SERVER_URL` | URL for the AI server API |
| `ai.server_username` | `AI_SERVER_USERNAME` | Username for AI server authentication |
| `ai.server_password` | `AI_SERVER_PASSWORD` | Password for AI server authentication |
| `cors.origin` | `CORS_ORIGIN` | Primary CORS origin |
| `cors.allowed_origins` | `ALLOWED_ORIGINS` | Comma-separated list of allowed origins |

## How It Works

The configuration system automatically detects the environment:

1. **Firebase Functions Environment**: Uses `functions.config()` to access configuration
2. **Local Development**: Uses `process.env` to access environment variables from `.env` file
3. **Fallback Values**: Provides sensible defaults for development

## Deployment Process

1. Set your environment variables using Firebase CLI:
   ```bash
   firebase functions:config:set ai.server_url="YOUR_PRODUCTION_AI_SERVER_URL"
   ```

2. Deploy your functions:
   ```bash
   npm run deploy
   ```

3. The functions will automatically use the Firebase config values in production.

## Testing Configuration

You can test your configuration by checking the function logs:

```bash
# View function logs
firebase functions:log

# View real-time logs
firebase functions:log --follow
```

The API service will log configuration warnings if it fails to retrieve values.

## Security Notes

- Never commit `.env` files to version control
- Use Firebase Functions config for production secrets
- Consider using Firebase Secret Manager for highly sensitive data
- Rotate credentials regularly
