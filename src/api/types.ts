import { Schema } from '../../amplify/data/resource';

export type FireReport = Schema['FireReport'];
export type Comment = Schema['Comment'];
export type AlertZone = Schema['AlertZone'];
export type Subscription = Schema['Subscription'];
export type WeatherData = Schema['WeatherData'];

export type FireReportStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'FALSE_ALARM'
  | 'CONTAINED'
  | 'EXTINGUISHED';
export type AlertRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
export type NotificationPreference = 'EMAIL' | 'SMS' | 'PUSH' | 'ALL';

export interface CreateFireReportInput {
  latitude: number;
  longitude: number;
  imageUrl?: string;
  description?: string;
  status?: FireReportStatus;
  severity?: number;
  reporterId: string;
  timestamp: string;
  locationName?: string;
  county?: string;
}

export interface CreateCommentInput {
  content: string;
  timestamp: string;
  userId: string;
  userName?: string;
  fireReportId: string;
}
