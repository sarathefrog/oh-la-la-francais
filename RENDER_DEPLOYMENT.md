# Render Deployment Guide

This guide will help you deploy your Oh La La Français application to Render.

## Quick Start Summary

1. ✅ **Update Prisma Schema** - Switch from SQLite to PostgreSQL (Step 2)
2. ✅ **Push code to GitHub/GitLab** - Render connects to your repository
3. ✅ **Create PostgreSQL Database** on Render (Step 1)
4. ✅ **Deploy using Blueprint** (recommended) or manually set up services (Step 3)
5. ✅ **Configure Environment Variables** - Add your secrets
6. ✅ **Handle Google Credentials** - Convert to environment variable (Step 5)

**Estimated Time**: 15-30 minutes for first deployment

## Prerequisites

1. A GitHub or GitLab account with your repository pushed
2. A Render account (sign up at https://render.com)
3. Your environment variables ready

## Important Notes

⚠️ **SQLite Limitation**: Render doesn't support file-based SQLite databases well because the filesystem is ephemeral. You'll need to switch to **PostgreSQL** for production. This guide includes steps for that.

⚠️ **Multiple Services**: Your application has two parts:
- **Web Service**: Express API (dashboard-api.js)
- **Background Worker**: Telegram Bot (telegramBot-clean.js)

You'll need to create separate services for each.

## Step 1: Prepare Your Database

### Option A: Use Render PostgreSQL (Recommended)

1. Go to your Render Dashboard
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `oh-la-la-francais-db`
   - **Database**: `oh-la-la-francais`
   - **User**: `oh-la-la-francais-user` (or leave default)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine for development
4. Click **Create Database**
5. **Copy the Internal Database URL** - you'll need this later

### Option B: Keep SQLite (Not Recommended for Production)

If you want to try SQLite, note that data will be lost on each deploy. Not recommended.

## Step 2: Update Prisma Schema for PostgreSQL

Before deploying, update your Prisma schema to use PostgreSQL:

**File: `prisma/schema.prisma`**

Change:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run locally to test:
```bash
npx prisma generate
npx prisma db push
```

## Step 3: Deploy the Web Service (Express API)

### Option A: Using render.yaml (Easier - Recommended)

If you have a `render.yaml` file in your repository (already created for you), you can deploy everything at once:

1. In Render Dashboard, click **New +** → **Blueprint**
2. Connect your repository
3. Render will automatically detect `render.yaml` and create all services
4. Fill in the environment variables that say `sync: false`:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_BOT_USERNAME`
5. Click **Apply** to deploy everything

### Option B: Manual Setup

1. In Render Dashboard, click **New +** → **Web Service**
2. Connect your repository:
   - Click **Connect account** if you haven't already
   - Select your repository
   - Click **Connect**
3. Configure the service:
   - **Name**: `oh-la-la-francais-web`
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave blank (root of repo)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm ci && npx prisma generate && npm run build || true
     ```
     *(The `|| true` allows it to continue if Next.js build fails, since you might not be using Next.js)*
   
   - **Start Command**: 
     ```bash
     node src/dashboard-api.js
     ```
   
   - **Instance Type**: Free tier is fine for development

4. **Environment Variables**: Add these in the **Environment** section:
   ```
   NODE_ENV=production
   PORT=10000
   API_PORT=10000
   DATABASE_URL=<your-postgresql-internal-url-from-step-1>
   TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
   TELEGRAM_BOT_USERNAME=<your-bot-username>
   GOOGLE_CALENDAR_CREDENTIALS_PATH=./google-credentials.json
   GOOGLE_CALENDAR_TOKEN_PATH=./google-token.json
   JWT_SECRET=<generate-a-random-secret>
   ENCRYPTION_KEY=<generate-a-random-key>
   CORS_ORIGIN=https://oh-la-la-francais-web.onrender.com
   ```
   
   **Important**: Render automatically sets `PORT` environment variable. Your app should use `process.env.PORT`.

5. **Post-deploy Script** (Optional but recommended):
   Add this as an **Advanced** → **Post Deploy Script**:
   ```bash
   npx prisma db push
   ```
   This will run database migrations after each deploy.

6. Click **Create Web Service**

## Step 4: Deploy the Telegram Bot (Background Worker)

1. In Render Dashboard, click **New +** → **Background Worker**
2. Connect the same repository
3. Configure:
   - **Name**: `oh-la-la-francais-bot`
   - **Region**: Same as your web service
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Build Command**: 
     ```bash
     npm ci && npx prisma generate
     ```
   
   - **Start Command**: 
     ```bash
     node src/telegramBot-clean.js
     ```
   
   - **Instance Type**: Free tier

4. **Environment Variables**: Same as the web service:
   ```
   NODE_ENV=production
   DATABASE_URL=<same-postgresql-url>
   TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
   TELEGRAM_BOT_USERNAME=<your-bot-username>
   GOOGLE_CALENDAR_CREDENTIALS_PATH=./google-credentials.json
   GOOGLE_CALENDAR_TOKEN_PATH=./google-token.json
   JWT_SECRET=<same-as-web-service>
   ENCRYPTION_KEY=<same-as-web-service>
   ```

5. Click **Create Background Worker**

## Step 5: Handle Google Credentials

Since `google-credentials.json` is a file, you have two options:

### Option A: Convert to Environment Variable (Recommended)

1. Read your `google-credentials.json` file
2. Convert it to a base64 string or JSON string
3. Add it as an environment variable in both services:
   ```
   GOOGLE_CREDENTIALS_JSON=<paste-the-entire-json-as-string>
   ```
4. Update your code to read from the environment variable and write to a file at runtime, or parse it directly.

### Option B: Use Render's File System (Temporary)

1. Create the file in your build command or use a script
2. Note: Files created during build persist, but this is less secure

**Recommended Implementation**: Update `googleCalendarService.js` to read from environment variable if file doesn't exist.

## Step 6: Update Your Application Code

Make sure your Express app uses the PORT environment variable:

**File: `src/dashboard-api.js`**

Ensure you have:
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 7: Deploy and Test

1. **First Deploy**: 
   - Render will automatically build and deploy your services
   - Monitor the build logs for any errors
   - The first deploy might take 5-10 minutes

2. **Check Logs**:
   - Click on each service → **Logs** tab
   - Verify no errors are showing
   - Check that database connections are working

3. **Test Your Application**:
   - Web service URL: `https://oh-la-la-francais-web.onrender.com`
   - Test the API endpoints
   - Verify the Telegram bot is responding

## Step 8: Set Up Custom Domain (Optional)

1. In your web service, go to **Settings**
2. Under **Custom Domains**, add your domain
3. Follow Render's instructions to update DNS records

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct (use Internal Database URL for Render PostgreSQL)
- Check database service is running
- Verify Prisma migrations ran successfully

### Build Failures
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (Render uses Node 18 by default)

### Bot Not Starting
- Check environment variables are set correctly
- Verify Telegram bot token is valid
- Check logs for authentication errors

### Port Issues
- Ensure your code uses `process.env.PORT` (Render sets this automatically)
- Don't hardcode port numbers

## Environment Variables Checklist

Make sure all these are set in both services:

- ✅ `NODE_ENV=production`
- ✅ `DATABASE_URL` (PostgreSQL connection string)
- ✅ `TELEGRAM_BOT_TOKEN`
- ✅ `TELEGRAM_BOT_USERNAME`
- ✅ `GOOGLE_CALENDAR_CREDENTIALS_PATH` (or use env var approach)
- ✅ `GOOGLE_CALENDAR_TOKEN_PATH`
- ✅ `JWT_SECRET` (generate: `openssl rand -base64 32`)
- ✅ `ENCRYPTION_KEY` (generate: `openssl rand -base64 32`)
- ✅ `CORS_ORIGIN` (your Render URL)
- ✅ Any other variables from your `env.example`

## Continuous Deployment

Render automatically deploys when you push to your connected branch. To disable:

1. Go to service **Settings**
2. Under **Auto-Deploy**, toggle off

## Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Limited to 750 hours/month per service
- Database has connection limits

For production, consider upgrading to a paid plan.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

**Need Help?** Check Render's logs first, then refer to their support documentation.

