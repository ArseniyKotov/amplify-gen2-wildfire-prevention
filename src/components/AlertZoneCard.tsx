/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState } from 'react';
import { AlertZone, NotificationPreference } from '../api/types';

interface AlertZoneCardProps {
  zone: AlertZone;
  onSubscribe?: (
    zoneId: string,
    preference: NotificationPreference
  ) => Promise<void>;
  userId?: string;
}

const getRiskLevelColor = (riskLevel: string | undefined) => {
  switch (riskLevel) {
    case 'LOW':
      return 'bg-green-500';
    case 'MODERATE':
      return 'bg-yellow-500';
    case 'HIGH':
      return 'bg-orange-500';
    case 'EXTREME':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const AlertZoneCard: React.FC<AlertZoneCardProps> = ({
  zone,
  onSubscribe,
  userId,
}) => {
  const [preference, setPreference] = useState<NotificationPreference>('EMAIL');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!onSubscribe || !userId) return;

    setIsSubscribing(true);
    setError(null);

    try {
      await onSubscribe(zone.id, preference);
      setSubscribed(true);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      console.error(err);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="card border border-accent-light">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{zone.name}</h3>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
            zone.riskLevel
          )}`}
        >
          {zone.riskLevel} RISK
        </div>
      </div>

      <p className="text-sm text-text-muted mb-2">{zone.county} County</p>

      {zone.activeAlert && (
        <div className="my-2 p-2 bg-red-900/30 border border-red-700 rounded-md">
          <p className="text-sm font-medium text-red-300">
            ⚠️ Active Alert in this zone
          </p>
        </div>
      )}

      <div className="mt-3">
        <p className="text-sm">
          <span className="text-text-muted">Last updated:</span>{' '}
          {new Date(zone.lastUpdated).toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="text-text-muted">Subscribers:</span>{' '}
          {zone.subscriberCount}
        </p>
      </div>

      {onSubscribe && userId && !subscribed ? (
        <div className="mt-4">
          <div className="mb-2">
            <label htmlFor={`preference-${zone.id}`} className="label">
              Notification Preference
            </label>
            <select
              id={`preference-${zone.id}`}
              className="select w-full"
              value={preference}
              onChange={(e) =>
                setPreference(e.target.value as NotificationPreference)
              }
            >
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="PUSH">Push Notification</option>
              <option value="ALL">All Methods</option>
            </select>
          </div>

          {error && (
            <div className="mb-2 p-2 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleSubscribe}
            className="btn btn-outline w-full"
            disabled={isSubscribing}
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe to Alerts'}
          </button>
        </div>
      ) : subscribed ? (
        <div className="mt-4 p-2 bg-green-900/30 border border-green-700 rounded-md">
          <p className="text-sm font-medium text-green-300">
            ✓ Subscribed to alerts
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default AlertZoneCard;
