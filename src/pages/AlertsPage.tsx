/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import AlertZoneCard from '../components/AlertZoneCard';
import { AlertZone, NotificationPreference } from '../api/types';
import { mockAlertZones } from '../mock/mockData';

const client = generateClient<Schema>();

interface AlertsPageProps {
  userId?: string;
}

const AlertsPage: React.FC<AlertsPageProps> = ({ userId }) => {
  const [alertZones, setAlertZones] = useState<AlertZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingError, setSeedingError] = useState<Error | null>(null);

  // Function to seed the database with mock alert zones
  useEffect(() => {
    const seedAlertZones = async () => {
      // Check if we've already seeded alert zones
      const hasSeeded = sessionStorage.getItem('alertZonesSeeded');
      if (hasSeeded === 'true') {
        console.log('Alert zones already seeded');
        return;
      }

      setIsSeeding(true);
      setSeedingError(null);

      try {
        // First check if we already have alert zones to avoid duplicates
        const { data: existingZones, errors: listErrors } =
          await client.models.AlertZone.list({
            limit: 1,
          });

        if (listErrors) {
          throw new Error(
            `Error checking existing alert zones: ${listErrors[0].message}`
          );
        }

        // If we already have data, don't seed
        if (existingZones.length > 0) {
          console.log('Alert zones already exist, skipping seed');
          sessionStorage.setItem('alertZonesSeeded', 'true');
          setIsSeeding(false);
          return;
        }

        console.log('Seeding alert zones...');

        // Create each alert zone from the mock data
        for (const zone of mockAlertZones) {
          const { errors: createErrors } = await client.models.AlertZone.create(
            {
              name: zone.name!,
              county: zone.county!,
              polygonCoordinates: zone.polygonCoordinates!,
              riskLevel: zone.riskLevel,
              activeAlert: zone.activeAlert!,
              lastUpdated: zone.lastUpdated!,
              subscriberCount: zone.subscriberCount,
            }
          );

          if (createErrors) {
            throw new Error(
              `Error creating alert zone: ${createErrors[0].message}`
            );
          }
        }

        console.log(`Successfully seeded alert zones`);
        sessionStorage.setItem('alertZonesSeeded', 'true');
      } catch (error) {
        console.error('Error seeding alert zones:', error);
        setSeedingError(
          error instanceof Error
            ? error
            : new Error('Unknown error during seeding')
        );
      } finally {
        setIsSeeding(false);
      }
    };

    seedAlertZones();
  }, []);

  // Fetch alert zones
  useEffect(() => {
    const fetchAlertZones = async () => {
      setLoading(true);
      try {
        const { data, errors } = await client.models.AlertZone.list();
        if (errors) {
          throw new Error(errors[0].message);
        }
        setAlertZones(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch alert zones')
        );
        console.error('Error fetching alert zones:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if not currently seeding
    if (!isSeeding) {
      fetchAlertZones();
    }
  }, [isSeeding]);

  const handleSubscribe = async (
    zoneId: string,
    preference: NotificationPreference
  ) => {
    if (!userId) {
      alert('You must be logged in to subscribe to alerts');
      return;
    }

    try {
      const { data, errors } = await client.models.Subscription.create({
        userId,
        alertZoneId: zoneId,
        notificationPreference: preference,
        createdAt: new Date().toISOString(),
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      // Update subscriber count
      const zone = alertZones.find((z) => z.id === zoneId);
      if (zone) {
        const { errors: updateErrors } = await client.models.AlertZone.update({
          id: zoneId,
          subscriberCount: (zone.subscriberCount || 0) + 1,
        });

        if (updateErrors) {
          console.error(
            'Error updating subscriber count:',
            updateErrors[0].message
          );
        }
      }

      return data;
    } catch (err) {
      console.error('Error subscribing to alert zone:', err);
      throw err;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wildfire Alert Zones</h1>

      {isSeeding && (
        <div className="card mb-6 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-3"></div>
          <p>Initializing alert zones...</p>
        </div>
      )}

      {seedingError && (
        <div className="card bg-red-900/30 border border-red-700 mb-6">
          <p className="text-red-300">
            Error initializing alert zones: {seedingError.message}
          </p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-text-muted">
          Subscribe to alert zones to receive notifications about wildfire risks
          and active fires in your area. Alerts are based on real-time fire
          reports, weather conditions, and official emergency information.
        </p>
      </div>

      {loading && !isSeeding ? (
        <div className="card flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="card bg-red-900/30 border border-red-700">
          <p className="text-red-300">
            Error loading alert zones: {error.message}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alertZones.length > 0 ? (
            alertZones.map((zone) => (
              <AlertZoneCard
                key={zone.id}
                zone={zone}
                onSubscribe={userId ? handleSubscribe : undefined}
                userId={userId}
              />
            ))
          ) : (
            <div className="col-span-full card">
              <p className="text-center text-text-muted">
                No alert zones available.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
