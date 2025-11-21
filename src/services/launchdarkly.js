// LaunchDarkly Session Replay and Observability Client Initialization
// Based on: https://launchdarkly.com/docs/sdk/observability/javascript
import { initialize } from 'launchdarkly-js-client-sdk';
import Observability from '@launchdarkly/observability';
import SessionReplay, { LDRecord } from '@launchdarkly/session-replay';

let ldClient = null;
let isInitialized = false;

/**
 * Initialize LaunchDarkly client with observability and session replay plugins
 * @param {string} clientSideId - Your LaunchDarkly client-side ID
 * @param {object} user - User context (optional, can be anonymous)
 * @param {object} options - Configuration options
 * @param {boolean} options.manualStart - If true, plugins won't start automatically
 * @param {string} options.privacySetting - Session replay privacy: 'none', 'default', or 'strict'
 * @param {boolean} options.startSessionReplay - Whether to start session replay immediately (default: true)
 */
export async function initializeLaunchDarkly(
  clientSideId,
  user = null,
  options = {}
) {
  if (isInitialized) {
    console.warn('LaunchDarkly client already initialized');
    return ldClient;
  }

  // Default to anonymous user if none provided
  const userContext = user || {
    kind: 'user',
    key: `anonymous-${Date.now()}`,
    anonymous: true,
  };

  const {
    manualStart = false,
    privacySetting = 'default', // 'none', 'default', or 'strict'
    startSessionReplay = true,
  } = options;

  try {
    // Initialize LaunchDarkly client with observability and session replay plugins
    // Reference: https://launchdarkly.com/docs/sdk/observability/javascript
    ldClient = initialize(clientSideId, userContext, {
      plugins: [
        new Observability({
          manualStart: manualStart,
        }),
        new SessionReplay({
          manualStart: manualStart,
          privacySetting: privacySetting, // Redacts PII based on setting
        }),
      ],
    });

    // Wait for client to be ready
    await ldClient.waitForInitialization();

    isInitialized = true;
    console.log('LaunchDarkly client initialized with observability and session replay');

    // Start plugins if not using manual start
    if (!manualStart) {
      if (startSessionReplay) {
        // Start session replay recording
        // Note: Rage click detection is automatically handled by LaunchDarkly
        // Configure thresholds in Project Settings > Monitoring > Session settings
        // Reference: https://launchdarkly.com/docs/home/observability/settings
        LDRecord.start({
          forceNew: false, // Continue existing session if available
          silent: false, // Show console warnings
        });
        console.log('Session replay started');
      }
    }

    return ldClient;
  } catch (error) {
    console.error('Failed to initialize LaunchDarkly:', error);
    throw error;
  }
}

/**
 * Get the LaunchDarkly client instance
 * @returns {object|null} The LaunchDarkly client or null if not initialized
 */
export function getLaunchDarklyClient() {
  return ldClient;
}

/**
 * Check if a feature flag is enabled
 * @param {string} flagKey - The feature flag key
 * @param {boolean} defaultValue - Default value if client is not initialized or flag not found
 * @returns {boolean} The flag value
 */
export function isFeatureFlagEnabled(flagKey, defaultValue = false) {
  if (!ldClient || !isInitialized) {
    return defaultValue;
  }
  try {
    return ldClient.variation(flagKey, defaultValue);
  } catch (error) {
    console.error(`Error checking feature flag ${flagKey}:`, error);
    return defaultValue;
  }
}

/**
 * Note: Rage click detection is automatically handled by LaunchDarkly's session replay.
 * Configure rage click thresholds in LaunchDarkly dashboard:
 * Project Settings > Monitoring > Session settings > Rage clicks
 * 
 * Default settings:
 * - Elapsed time: 2 seconds
 * - Radius: 8 pixels  
 * - Minimum clicks: 5 clicks
 * 
 * Sessions with rage clicks will be marked with the `has_rage_clicks` attribute
 * and can be filtered/searched in the LaunchDarkly UI.
 * 
 * Reference: https://launchdarkly.com/docs/home/observability/settings
 */
