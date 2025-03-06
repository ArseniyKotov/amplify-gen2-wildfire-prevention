import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a
  .schema({
    FireReport: a.model({
      id: a.id(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      imageUrl: a.string(),
      description: a.string(),
      status: a.enum([
        'REPORTED',
        'VERIFIED',
        'FALSE_ALARM',
        'CONTAINED',
        'EXTINGUISHED',
      ]),
      severity: a.integer(),
      reporterId: a.string(),
      timestamp: a.datetime().required(),
      verifiedBy: a.string(),
      locationName: a.string(),
      county: a.string(),
      comments: a.hasMany('Comment', 'fireReportId'),
    }),
    Comment: a.model({
      id: a.id(),
      content: a.string().required(),
      timestamp: a.datetime().required(),
      userId: a.string().required(),
      userName: a.string(),
      fireReportId: a.id(),
      fireReport: a.belongsTo('FireReport', 'fireReportId'),
    }),
    AlertZone: a.model({
      id: a.id(),
      name: a.string().required(),
      county: a.string().required(),
      polygonCoordinates: a.string().required(), // GeoJSON format as string
      riskLevel: a.enum(['LOW', 'MODERATE', 'HIGH', 'EXTREME']),
      activeAlert: a.boolean().required(),
      lastUpdated: a.datetime().required(),
      subscriberCount: a.integer(),
      subscriptions: a.hasMany('AlertZone', 'subscriptionId'),
    }),
    Subscription: a.model({
      id: a.id(),
      userId: a.string().required(),
      alertZoneId: a.id(),
      alertZone: a.belongsTo('AlertZone', 'alertZoneId'),
      notificationPreference: a.enum(['EMAIL', 'SMS', 'PUSH', 'ALL']),
      createdAt: a.datetime().required(),
    }),
    WeatherData: a.model({
      id: a.id(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      temperature: a.float(),
      humidity: a.float(),
      windSpeed: a.float(),
      windDirection: a.float(),
      timestamp: a.datetime().required(),
      fireRiskIndex: a.float(),
      county: a.string(),
    }),
  })
  .authorization((allow) => [
    allow.guest().to(['read']),
    allow.owner().to(['read', 'create', 'update', 'delete']),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
