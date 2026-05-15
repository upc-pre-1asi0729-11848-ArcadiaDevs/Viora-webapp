export const environment = {
  production: false,

  vioraPlatformApiUrl: 'http://localhost:3000/api/v1',

  endpoints: {
    plots: '/plots',
    agronomicRecords: '/agronomic-records',
    monitoringSummaries: '/monitoring-summaries',
    weatherSummaries: '/weather-summaries',
    yieldForecasts: '/yield-forecasts',
    riskAssessments: '/risk-assessments',
    healthDistribution: '/health-distribution',
    iotDeviceSummaries: '/iot-device-summaries',
    agronomicStatistics: '/agronomic-statistics',
    alerts: '/alerts',
    iotDevices: '/iot-devices',
  },

  mapbox: {
    accessToken: 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE',
  },
};
