# LaunchDarkly Session Replay Setup

This guide explains how to set up LaunchDarkly session replay with observability and rage click detection in your application.

**Official Documentation:**
- [JavaScript Observability SDK](https://launchdarkly.com/docs/sdk/observability/javascript)
- [Session Replay Configuration](https://launchdarkly.com/docs/sdk/features/session-replay-config#expand-javascript-code-sample)

## Installation

1. Install the required packages:
   ```bash
   npm install launchdarkly-js-client-sdk @launchdarkly/observability @launchdarkly/session-replay
   ```

   **Note:** The observability plugin requires JavaScript SDK version 3.7.0 or later.

## Configuration

### 1. Get Your LaunchDarkly Client-Side ID

1. Log in to your LaunchDarkly account
2. Navigate to **Project Settings** > **Environments**
3. Copy your **Client-side ID** (it looks like: `1234567890abcdef12345678`)

### 2. Set Environment Variable

Create a `.env` file in the root of your project:

```env
VITE_LAUNCHDARKLY_CLIENT_ID=your-client-side-id-here
```

**Important:** 
- Replace `your-client-side-id-here` with your actual LaunchDarkly client-side ID
- The `.env` file is already in `.gitignore` to keep your client ID secure
- **Restart your dev server** (`npm run dev`) after creating or modifying the `.env` file - Vite reads environment variables at startup

### 3. Initialize LaunchDarkly

The LaunchDarkly client is automatically initialized in `src/main.jsx` before React renders with:
- **Observability plugin** - For error monitoring, logging, and tracing
- **Session replay plugin** - For recording and replaying user sessions
- **Built-in rage click detection** - Automatically detects rage clicks (configure in LaunchDarkly dashboard)

**Note:** Initialization happens in `main.jsx` (the app entry point) to ensure session replay starts as early as possible, before React components render.

## How It Works

### Observability Plugin
- Automatically monitors errors, logs, and performance metrics
- Sends data to LaunchDarkly for analysis
- Provides tracing capabilities for frontend-backend correlation

### Session Replay
- Records user interactions, DOM changes, clicks, scrolls, and navigation
- Stores session data for replay in LaunchDarkly dashboard
- Configurable privacy settings to redact sensitive information

### Rage Click Detection
LaunchDarkly automatically detects rage clicks during session replay. Configure the detection thresholds in your LaunchDarkly dashboard:

1. Go to **Project Settings** > **Monitoring** > **Session settings**
2. Configure **Rage clicks** settings:
   - **Elapsed time** - Time window for clicks (default: 2 seconds)
   - **Radius** - Pixel radius for click proximity (default: 8 pixels)
   - **Minimum clicks** - Number of clicks to trigger (default: 5 clicks)

Sessions with rage clicks are automatically marked with the `has_rage_clicks` attribute and can be filtered/searched in the LaunchDarkly UI.

**Reference:** [LaunchDarkly Monitoring Settings](https://launchdarkly.com/docs/home/observability/settings)

## Configuration Options

### Privacy Settings

You can configure session replay privacy when initializing:

```javascript
initializeLaunchDarkly(clientSideId, user, {
  privacySetting: 'default', // Options: 'none', 'default', 'strict'
});
```

- **`'none'`** - No redaction, records everything
- **`'default'`** - Redacts text matching common regex patterns for PII (emails, SSNs, etc.)
- **`'strict'`** - Redacts all text and images

### Manual Start

If you want to start recording after user consent or feature flag check, you can modify `src/main.jsx`:

```javascript
// In main.jsx, set manualStart: true
initializeLaunchDarkly(clientSideId, user, {
  manualStart: true,
  startSessionReplay: false,
});

// Later, after user consent, you would need to manually start using:
// LDRecord.start() from @launchdarkly/session-replay
```

**Note:** For basic rage click detection, manual start is not needed. The default automatic start works perfectly.
s
## Viewing Rage Clicks

Rage clicks are automatically detected and associated with session replays. To view them:

1. Log in to LaunchDarkly
2. Navigate to **Observability** > **Session Replay**
3. Use the search filter: `has_rage_clicks:true` to find sessions with rage clicks
4. Replay sessions to see the exact user interactions

Rage click detection happens automatically - no custom code needed!

## Viewing Data in LaunchDarkly

### Session Replay
1. Log in to LaunchDarkly
2. Navigate to **Observability** > **Session Replay**
3. Filter sessions by rage click events or other criteria
4. Replay sessions to see user interactions

### Observability Metrics
LaunchDarkly automatically creates metrics from observability data:
- Average, P95, and P99 Cumulative Layout Shift (CLS)
- Average, P95, and P99 Document Load Latency
- Percentage of users with errors
- Average, P95, and P99 First Contentful Paint (FCP)
- Average, P95, and P99 First Input Delay (FID)
- Average, P95, and P99 Interaction to Next Paint (INP)
- Average, P95, and P99 Largest Contentful Paint (LCP)
- Average, P95, and P99 Time to First Byte (TTFB)

## Content Security Policy (CSP)

If your application uses Content Security Policy, add these directives:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="connect-src https://pub.observability.app.launchdarkly.com https://otel.observability.app.launchdarkly.com; worker-src data: blob:;"
/>
```

Or set in your HTML response header:
```
Content-Security-Policy: connect-src https://pub.observability.app.launchdarkly.com https://otel.observability.app.launchdarkly.com; worker-src data: blob:;
```

## Customization

### Adjust Rage Click Thresholds

Configure rage click detection in LaunchDarkly dashboard (not in code):

1. Go to **Project Settings** > **Monitoring** > **Session settings**
2. Adjust **Rage clicks** settings:
   - **Elapsed time** - Time window for detecting rage clicks
   - **Radius** - Pixel radius for click proximity
   - **Minimum clicks** - Number of clicks required to trigger detection
3. Click **Save**

These settings apply to all sessions automatically.

### Advanced Usage

For basic rage click detection, the default setup is sufficient. If you need advanced features like:
- User identification
- Custom event tracking
- Manual session replay control

You can extend the `launchdarkly.js` service file to add these functions. The current minimal implementation focuses on automatic rage click detection through session replay.

## Privacy Considerations

- Session replay captures all user interactions
- Sensitive data (like health information) may be recorded
- Consider:
  - Using `privacySetting: 'strict'` to redact all text and images
  - Adding user consent/opt-in with `manualStart: true`
  - Masking sensitive form fields
  - Allowing users to disable session replay

## Troubleshooting

### LaunchDarkly Not Initializing
- Check that `VITE_LAUNCHDARKLY_CLIENT_ID` is set correctly
- Verify your client-side ID is valid
- Ensure you're using JavaScript SDK version 3.7.0 or later
- Check browser console for error messages

### Session Replay Not Working
- Verify LaunchDarkly account has observability features enabled
- Check that plugins are properly initialized
- Ensure Content Security Policy allows connections to LaunchDarkly
- Check browser console for initialization errors

### Rage Clicks Not Detected
- Verify rage click detection is enabled in **Project Settings** > **Monitoring** > **Session settings**
- Check that your click pattern meets the configured thresholds (default: 5 clicks within 8 pixels in 2 seconds)
- Ensure session replay is recording (check that sessions are being captured)
- Use the search filter `has_rage_clicks:true` in the Session Replay UI to verify detection

## Additional Resources

- [LaunchDarkly JavaScript Observability SDK Documentation](https://launchdarkly.com/docs/sdk/observability/javascript)
- [Session Replay Configuration Guide](https://launchdarkly.com/docs/sdk/features/session-replay-config#expand-javascript-code-sample)
- [LaunchDarkly Observability Overview](https://launchdarkly.com/docs/home/users/observability)
