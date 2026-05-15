export const environment = {
  production: false,

  vioraPlatformApiUrl: 'https://69ff99d02b7ab349602fc9e2.mockapi.io/api/v1/',

  endpoints: {
    plots: '/plots',
    agronomicRecords: '/agronomic-records',
    monitoringSummaries: '/monitoring-summaries',
    weatherSummaries: '/weather-summaries',
    yieldForecasts: '/yield-forecasts',
    riskAssessments: '/risk-assessments',
    healthDistribution: '/health-distribution',
    categories: '/categories',
    tutorials: '/tutorials',
    signUp: '/authentication/sign-up',
    signIn: '/authentication/sign-in',
    users: '/users',
    iotDeviceSummaries: '/iot-device-summaries',
    agronomicStatistics: '/agronomic-statistics',
    alerts: '/alerts',
    iotDevices: '/iot-devices',
  },

  mapbox: {
    accessToken: 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE',
  },
};
