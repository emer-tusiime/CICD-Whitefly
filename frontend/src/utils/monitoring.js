/**
 * Grafana Faro Monitoring Configuration
 * 
 * This file initializes Grafana Faro for frontend observability:
 * - Performance monitoring
 * - Error tracking
 * - User session tracking
 * - API call monitoring
 */

import { initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

let faro = null;

/**
 * Initialize Grafana Faro monitoring
 * Only initializes in production or when explicitly enabled
 */
export const initializeMonitoring = () => {
  // Check if monitoring is enabled
  const faroUrl = import.meta.env.VITE_GRAFANA_FARO_URL;
  const faroAppId = import.meta.env.VITE_GRAFANA_FARO_APP_ID;
  
  // Skip initialization if credentials are missing
  if (!faroUrl || !faroAppId) {
    console.log('📊 Grafana Faro: Monitoring disabled (missing credentials)');
    return null;
  }

  // Skip in development unless explicitly enabled
  if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_MONITORING) {
    console.log('📊 Grafana Faro: Monitoring disabled in development');
    return null;
  }

  try {
    faro = initializeFaro({
      // Faro collector URL
      url: faroUrl,
      
      // Application configuration
      app: {
        name: import.meta.env.VITE_GRAFANA_FARO_APP_NAME || 'WhiteFly Frontend',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.VITE_GRAFANA_FARO_ENV || 'production',
      },

      // User identification (optional - set after login)
      user: {
        id: faroAppId,
      },

      // Session configuration
      sessionTracking: {
        enabled: true,
        persistent: true,
      },

      // Sampling rate (1.0 = 100%, 0.1 = 10%)
      // Reduce for high-traffic apps to save costs
      sessionSampleRate: parseFloat(import.meta.env.VITE_FARO_SAMPLE_RATE || '1.0'),

      // Instrumentations - what to monitor
      instrumentations: [
        // Standard web instrumentations
        ...getWebInstrumentations({
          // Capture console logs
          captureConsole: true,
          
          // Capture console log levels
          captureConsoleDisabledLevels: [], // Capture all levels
          
          // Disable console instrumentation in development
          disableConsoleInstrumentation: import.meta.env.DEV,
        }),

        // Distributed tracing for API calls
        new TracingInstrumentation({
          // Instrument fetch API
          instrumentationOptions: {
            // Propagate trace context to backend
            propagateTraceHeaderCorsUrls: [
              new RegExp(import.meta.env.VITE_API_URL || 'http://localhost:8000'),
              /https:\/\/cicd-whitefly-v2\.onrender\.com/,
            ],
          },
        }),
      ],

      // Privacy: Sanitize data before sending
      beforeSend: (event) => {
        // Remove sensitive data from error messages
        if (event.type === 'exception' && event.value) {
          // Mask passwords in error messages
          event.value = event.value.replace(/password[=:]\s*\S+/gi, 'password=***');
          // Mask tokens
          event.value = event.value.replace(/token[=:]\s*\S+/gi, 'token=***');
          // Mask API keys
          event.value = event.value.replace(/api[_-]?key[=:]\s*\S+/gi, 'api_key=***');
        }

        // Remove sensitive query parameters from URLs
        if (event.context?.page?.url) {
          const url = new URL(event.context.page.url);
          url.searchParams.delete('token');
          url.searchParams.delete('password');
          url.searchParams.delete('api_key');
          event.context.page.url = url.toString();
        }

        return event;
      },

      // Batch events before sending (performance optimization)
      batching: {
        enabled: true,
        sendTimeout: 250, // Send batch every 250ms
      },
    });

    console.log('✅ Grafana Faro: Monitoring initialized successfully');
    return faro;
  } catch (error) {
    console.error('❌ Grafana Faro: Failed to initialize monitoring:', error);
    return null;
  }
};

/**
 * Get the Faro instance
 */
export const getFaro = () => faro;

/**
 * Set user information after login
 * @param {Object} user - User object with id, username, email
 */
export const setUser = (user) => {
  if (!faro) return;

  try {
    faro.api.setUser({
      id: user.id?.toString() || user.username,
      username: user.username,
      email: user.email,
      attributes: {
        role: 'user',
      },
    });
    console.log('📊 Grafana Faro: User identified');
  } catch (error) {
    console.error('❌ Grafana Faro: Failed to set user:', error);
  }
};

/**
 * Clear user information on logout
 */
export const clearUser = () => {
  if (!faro) return;

  try {
    faro.api.resetUser();
    console.log('📊 Grafana Faro: User cleared');
  } catch (error) {
    console.error('❌ Grafana Faro: Failed to clear user:', error);
  }
};

/**
 * Track custom events
 * @param {string} name - Event name
 * @param {Object} attributes - Event attributes
 */
export const trackEvent = (name, attributes = {}) => {
  if (!faro) return;

  try {
    faro.api.pushEvent(name, attributes);
  } catch (error) {
    console.error('❌ Grafana Faro: Failed to track event:', error);
  }
};

/**
 * Track image upload
 * @param {number} count - Number of images uploaded
 * @param {number} duration - Upload duration in ms
 */
export const trackImageUpload = (count, duration) => {
  trackEvent('image_upload', {
    count,
    duration_ms: duration,
    success: true,
  });
};

/**
 * Track detection result
 * @param {number} whiteflyCount - Number of whiteflies detected
 * @param {number} processingTime - Processing time in ms
 */
export const trackDetection = (whiteflyCount, processingTime) => {
  trackEvent('detection_completed', {
    whitefly_count: whiteflyCount,
    processing_time_ms: processingTime,
  });
};

/**
 * Track CSV export
 */
export const trackCSVExport = () => {
  trackEvent('csv_export', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track navigation
 * @param {string} page - Page name
 */
export const trackNavigation = (page) => {
  trackEvent('navigation', {
    page,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track API errors
 * @param {string} endpoint - API endpoint
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 */
export const trackAPIError = (endpoint, status, message) => {
  if (!faro) return;

  try {
    faro.api.pushError(new Error(`API Error: ${endpoint}`), {
      type: 'api_error',
      context: {
        endpoint,
        status,
        message,
      },
    });
  } catch (error) {
    console.error('❌ Grafana Faro: Failed to track API error:', error);
  }
};

/**
 * Manually track an error
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export const trackError = (error, context = {}) => {
  if (!faro) return;

  try {
    faro.api.pushError(error, {
      type: 'application_error',
      context,
    });
  } catch (err) {
    console.error('❌ Grafana Faro: Failed to track error:', err);
  }
};

/**
 * Track performance measurement
 * @param {string} name - Measurement name
 * @param {number} duration - Duration in ms
 */
export const trackPerformance = (name, duration) => {
  if (!faro) return;

  try {
    faro.api.pushMeasurement({
      type: 'custom',
      values: {
        [name]: duration,
      },
    });
  } catch (error) {
    console.error('❌ Grafana Faro: Failed to track performance:', error);
  }
};

export default {
  initializeMonitoring,
  getFaro,
  setUser,
  clearUser,
  trackEvent,
  trackImageUpload,
  trackDetection,
  trackCSVExport,
  trackNavigation,
  trackAPIError,
  trackError,
  trackPerformance,
};
