/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import FireMap from '../components/FireMap';
import { FireReport } from '../api/types';

const client = generateClient<Schema>();

const MapPage: React.FC = () => {
  const [reports, setReports] = useState<FireReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string>('');

  // List of California counties
  const counties = [
    'Alameda',
    'Alpine',
    'Amador',
    'Butte',
    'Calaveras',
    'Colusa',
    'Contra Costa',
    'Del Norte',
    'El Dorado',
    'Fresno',
    'Glenn',
    'Humboldt',
    'Imperial',
    'Inyo',
    'Kern',
    'Kings',
    'Lake',
    'Lassen',
    'Los Angeles',
    'Madera',
    'Marin',
    'Mariposa',
    'Mendocino',
    'Merced',
    'Modoc',
    'Mono',
    'Monterey',
    'Napa',
    'Nevada',
    'Orange',
    'Placer',
    'Plumas',
    'Riverside',
    'Sacramento',
    'San Benito',
    'San Bernardino',
    'San Diego',
    'San Francisco',
    'San Joaquin',
    'San Luis Obispo',
    'San Mateo',
    'Santa Barbara',
    'Santa Clara',
    'Santa Cruz',
    'Shasta',
    'Sierra',
    'Siskiyou',
    'Solano',
    'Sonoma',
    'Stanislaus',
    'Sutter',
    'Tehama',
    'Trinity',
    'Tulare',
    'Tuolumne',
    'Ventura',
    'Yolo',
    'Yuba',
  ];

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        let result;

        if (selectedCounty) {
          result = await client.models.FireReport.list({
            filter: { county: { eq: selectedCounty } },
          });
        } else {
          result = await client.models.FireReport.list();
        }

        const { data, errors } = result;

        if (errors) {
          throw new Error(errors[0].message);
        }

        setReports(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch fire reports')
        );
        console.error('Error fetching fire reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedCounty]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">California Wildfire Map</h1>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div>
            <label htmlFor="county-filter" className="label">
              Filter by County
            </label>
            <select
              id="county-filter"
              className="select"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
            >
              <option value="">All Counties</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Reported</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-sm">Verified</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Contained</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Extinguished</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="card bg-red-900/30 border border-red-700">
          <p className="text-red-300">
            Error loading fire reports: {error.message}
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="h-[600px] w-full">
            <FireMap reports={reports} />
          </div>

          <div className="mt-4">
            <p className="text-text-muted">
              {reports.length} fire{' '}
              {reports.length === 1 ? 'report' : 'reports'} displayed
              {selectedCounty ? ` in ${selectedCounty} County` : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
