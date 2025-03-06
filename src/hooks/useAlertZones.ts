/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { AlertZone } from '../api/types';

const client = generateClient<Schema>();

export function useAlertZones() {
  const [alertZones, setAlertZones] = useState<AlertZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlertZones = async () => {
    setLoading(true);
    try {
      const { data, errors } = await client.models.AlertZone.list();
      if (errors) throw new Error(errors[0].message);
      setAlertZones(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
    } finally {
      setLoading(false);
    }
  };

  const subscribeToAlertZone = async (
    userId: string,
    alertZoneId: string,
    preference: string
  ) => {
    try {
      const { data, errors } = await client.models.Subscription.create({
        userId,
        alertZoneId,
        notificationPreference: preference,
        createdAt: new Date().toISOString(),
      });
      if (errors) throw new Error(errors[0].message);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to subscribe to alert zone')
      );
      return null;
    }
  };

  useEffect(() => {
    fetchAlertZones();
  }, []);

  return {
    alertZones,
    loading,
    error,
    fetchAlertZones,
    subscribeToAlertZone,
  };
}
