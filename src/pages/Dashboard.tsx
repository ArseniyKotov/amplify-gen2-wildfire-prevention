/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import FireMap from '../components/FireMap';
import FireReportList from '../components/FireReportList';
import WeatherDataCard from '../components/WeatherDataCard';
import { FireReport, WeatherData } from '../api/types';
import { mockFireReports, mockWeatherData } from '../mock/mockData';

const client = generateClient<Schema>();

interface DashboardProps {
  userId?: string;
  isAdmin?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, isAdmin = false }) => {
  const [reports, setReports] = useState<FireReport[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingError, setSeedingError] = useState<Error | null>(null);
  const [seedingComplete, setSeedingComplete] = useState(false);

  // Function to seed the database with mock data
  useEffect(() => {
    const seedDatabase = async () => {
      // Check if we've already seeded the database in this session
      const hasSeeded = sessionStorage.getItem('dbSeeded');
      if (hasSeeded === 'true') {
        console.log('Database already seeded in this session');
        return;
      }

      setIsSeeding(true);
      setSeedingError(null);

      try {
        // First check if we already have data to avoid duplicates
        const { data: existingReports, errors: listErrors } =
          await client.models.FireReport.list({
            limit: 1,
          });

        if (listErrors) {
          throw new Error(
            `Error checking existing reports: ${listErrors[0].message}`
          );
        }

        // If we already have data, don't seed
        if (existingReports.length > 0) {
          console.log('Database already has data, skipping seed');
          sessionStorage.setItem('dbSeeded', 'true');
          setIsSeeding(false);
          setSeedingComplete(true);
          return;
        }

        console.log('Seeding database with mock data...');

        // Create each fire report from the mock data
        for (const report of mockFireReports) {
          const { errors: createErrors } =
            await client.models.FireReport.create({
              latitude: report.latitude!,
              longitude: report.longitude!,
              description: report.description,
              status: report.status,
              severity: report.severity,
              reporterId: report.reporterId!,
              timestamp: report.timestamp!,
              locationName: report.locationName,
              county: report.county,
            });

          if (createErrors) {
            throw new Error(
              `Error creating fire report: ${createErrors[0].message}`
            );
          }
        }

        // Create weather data
        for (const weather of mockWeatherData) {
          const { errors: createErrors } =
            await client.models.WeatherData.create({
              latitude: weather.latitude!,
              longitude: weather.longitude!,
              temperature: weather.temperature,
              humidity: weather.humidity,
              windSpeed: weather.windSpeed,
              windDirection: weather.windDirection,
              timestamp: weather.timestamp!,
              fireRiskIndex: weather.fireRiskIndex,
              county: weather.county,
            });

          if (createErrors) {
            throw new Error(
              `Error creating weather data: ${createErrors[0].message}`
            );
          }
        }

        console.log(`Successfully seeded database with mock data`);
        sessionStorage.setItem('dbSeeded', 'true');
        setSeedingComplete(true);
      } catch (error) {
        console.error('Error seeding database:', error);
        setSeedingError(
          error instanceof Error
            ? error
            : new Error('Unknown error during seeding')
        );
      } finally {
        setIsSeeding(false);
      }
    };

    seedDatabase();
  }, []);

  // Fetch fire reports and weather data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch fire reports
        const { data: reportData, errors: reportErrors } =
          await client.models.FireReport.list();
        if (reportErrors) {
          throw new Error(reportErrors[0].message);
        }
        setReports(reportData);

        // Fetch weather data
        const { data: weatherData, errors: weatherErrors } =
          await client.models.WeatherData.list();
        if (weatherErrors) {
          throw new Error(weatherErrors[0].message);
        }
        setWeatherData(weatherData);

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch data')
        );
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if seeding is complete or not needed
    if (
      !isSeeding &&
      (seedingComplete || sessionStorage.getItem('dbSeeded') === 'true')
    ) {
      fetchData();
    }
  }, [isSeeding, seedingComplete]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { data, errors } = await client.models.FireReport.update({
        id,
        status,
      });

      if (errors) throw new Error(errors[0].message);

      // Update the local state
      setReports((prev) =>
        prev.map((report) => (report.id === id ? data : report))
      );
    } catch (err) {
      console.error('Error updating report status:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">California Wildfire Dashboard</h1>

      {isSeeding && (
        <div className="card mb-6 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-3"></div>
          <p>Initializing data...</p>
        </div>
      )}

      {seedingError && (
        <div className="card bg-red-900/30 border border-red-700 mb-6">
          <p className="text-red-300">
            Error initializing data: {seedingError.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Active Fires Map</h2>
            <div className="h-[400px] w-full">
              <FireMap reports={reports} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Weather Conditions</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="card flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : weatherData.length > 0 ? (
              weatherData.map((data) => (
                <WeatherDataCard key={data.id} data={data} />
              ))
            ) : (
              <div className="card">
                <p className="text-center text-text-muted">
                  No weather data available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Fire Reports</h2>
        <FireReportList
          reports={reports}
          loading={loading}
          error={error}
          onStatusUpdate={isAdmin ? handleStatusUpdate : undefined}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default Dashboard;
