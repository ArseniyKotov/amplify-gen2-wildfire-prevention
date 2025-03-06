/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { FireReport, AlertZone, WeatherData } from '../api/types';

export const mockFireReports: Partial<FireReport>[] = [
  {
    latitude: 34.0522,
    longitude: -118.2437,
    description: 'Smoke visible from hillside',
    status: 'REPORTED',
    severity: 2,
    reporterId: 'user1',
    timestamp: new Date().toISOString(),
    locationName: 'Griffith Park',
    county: 'Los Angeles',
  },
  {
    latitude: 37.7749,
    longitude: -122.4194,
    description: 'Small brush fire near hiking trail',
    status: 'VERIFIED',
    severity: 3,
    reporterId: 'user2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    locationName: 'Twin Peaks',
    county: 'San Francisco',
  },
  {
    latitude: 36.7783,
    longitude: -119.4179,
    description: 'Lightning strike caused small fire',
    status: 'CONTAINED',
    severity: 1,
    reporterId: 'user3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    locationName: 'Sierra National Forest',
    county: 'Fresno',
  },
];

export const mockAlertZones: Partial<AlertZone>[] = [
  {
    name: 'Los Angeles County High Risk Zone',
    county: 'Los Angeles',
    polygonCoordinates: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [-118.5, 34.0],
          [-118.2, 34.0],
          [-118.2, 34.3],
          [-118.5, 34.3],
          [-118.5, 34.0],
        ],
      ],
    }),
    riskLevel: 'HIGH',
    activeAlert: true,
    lastUpdated: new Date().toISOString(),
    subscriberCount: 1245,
  },
  {
    name: 'San Francisco Bay Area',
    county: 'San Francisco',
    polygonCoordinates: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [-122.5, 37.7],
          [-122.3, 37.7],
          [-122.3, 37.9],
          [-122.5, 37.9],
          [-122.5, 37.7],
        ],
      ],
    }),
    riskLevel: 'MODERATE',
    activeAlert: false,
    lastUpdated: new Date().toISOString(),
    subscriberCount: 987,
  },
];

export const mockWeatherData: Partial<WeatherData>[] = [
  {
    latitude: 34.0522,
    longitude: -118.2437,
    temperature: 85.4,
    humidity: 15.2,
    windSpeed: 12.5,
    windDirection: 270,
    timestamp: new Date().toISOString(),
    fireRiskIndex: 0.78,
    county: 'Los Angeles',
  },
  {
    latitude: 37.7749,
    longitude: -122.4194,
    temperature: 68.2,
    humidity: 42.5,
    windSpeed: 8.3,
    windDirection: 225,
    timestamp: new Date().toISOString(),
    fireRiskIndex: 0.45,
    county: 'San Francisco',
  },
];
