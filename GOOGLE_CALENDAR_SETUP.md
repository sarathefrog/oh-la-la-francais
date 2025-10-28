# Google Calendar Integration Setup Guide

## Overview
Your bot now has full Google Calendar integration for managing test classes and calendar events. This guide will help you set up the Google Calendar API.

## Prerequisites
- Google Cloud Console account
- Node.js project with the bot already set up

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized redirect URIs:
   - `http://localhost:3001` (for development)
   - Your production domain (when deployed)
5. Download the credentials JSON file

## Step 3: Configure Credentials

1. Rename the downloaded file to `google-credentials.json`
2. Place it in your project root directory (same level as `package.json`)
3. The file should look like this:

```json
{
  "client_id": "your-client-id.apps.googleusercontent.com",
  "project_id": "your-project-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_secret": "your-client-secret",
  "redirect_uris": ["http://localhost:3001"]
}
```

## Step 4: Test the Integration

1. Start your bot: `npm run start-bot`
2. Open the dashboard: `http://localhost:3001/dashboard.html`
3. Go to the "📅 تقویم" (Calendar) tab
4. Click "🔗 اتصال به Google Calendar" (Connect to Google Calendar)
5. Complete the OAuth flow in the popup window
6. You should see your Google Calendar events in the dashboard

## Features Available

### Dashboard Calendar Tab
- **View Google Calendar Events**: See all your calendar events
- **Statistics**: Count of events, classes, test classes, and today's events
- **Real-time Sync**: Events are fetched from Google Calendar in real-time
- **Persian Interface**: All text is in Persian with proper RTL layout

### Bot Calendar Commands
- **📅 تقویم**: Access calendar menu
- **📅 رویدادهای امروز**: View today's events
- **📅 رویدادهای این هفته**: View this week's events
- **➕ ایجاد رویداد جدید**: Create new events (coming soon)
- **📊 آمار تقویم**: Calendar statistics (coming soon)

### Test Class Integration
- Test classes are automatically created in Google Calendar when approved
- Events include student information and contact details
- Automatic reminders and notifications

## API Endpoints

The bot provides these calendar API endpoints:

- `GET /api/calendar/auth-url` - Get Google OAuth URL
- `POST /api/calendar/authenticate` - Complete OAuth authentication
- `GET /api/calendar/status` - Check authentication status
- `GET /api/calendar/events` - Get calendar events
- `POST /api/calendar/events` - Create new events
- `POST /api/calendar/test-class` - Create test class events

## Troubleshooting

### Common Issues

1. **"Calendar not authenticated" error**:
   - Make sure `google-credentials.json` is in the project root
   - Check that the redirect URI matches your setup
   - Try re-authenticating through the dashboard

2. **"Failed to generate auth URL" error**:
   - Verify the credentials file format
   - Check that Google Calendar API is enabled
   - Ensure the project ID is correct

3. **Events not showing**:
   - Check if you have events in your Google Calendar
   - Verify the timezone settings (set to Asia/Tehran)
   - Try refreshing the calendar tab

### Debug Mode

To see detailed logs, check the console output when running the bot. Look for:
- `✅ Google Calendar service ready` - Service initialized successfully
- `⚠️ Google Calendar service not initialized` - Credentials missing or invalid
- `❌ Error fetching calendar events` - API connection issues

## Security Notes

- Keep your `google-credentials.json` file secure and never commit it to version control
- The `google-token.json` file (created after authentication) contains sensitive tokens
- Add both files to your `.gitignore`:
  ```
  google-credentials.json
  google-token.json
  ```

## Production Deployment

When deploying to production:

1. Update the redirect URIs in Google Cloud Console to include your production domain
2. Update the credentials file with the new redirect URI
3. Ensure your production server can access Google APIs
4. Consider using environment variables for sensitive configuration

## Support

If you encounter issues:

1. Check the bot console logs for error messages
2. Verify your Google Cloud Console settings
3. Test the OAuth flow manually
4. Check that all required permissions are granted

The integration is now complete and ready to use! 🎉
