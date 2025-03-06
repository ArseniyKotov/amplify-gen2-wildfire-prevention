/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React from 'react';
import { FireReport } from '../api/types';

interface FireReportListProps {
  reports: FireReport[];
  loading: boolean;
  error: Error | null;
  onStatusUpdate?: (id: string, status: string) => Promise<void>;
  isAdmin?: boolean;
}

const statusColors = {
  REPORTED: 'bg-red-500',
  VERIFIED: 'bg-orange-500',
  FALSE_ALARM: 'bg-gray-500',
  CONTAINED: 'bg-blue-500',
  EXTINGUISHED: 'bg-green-500',
};

const FireReportList: React.FC<FireReportListProps> = ({
  reports,
  loading,
  error,
  onStatusUpdate,
  isAdmin = false,
}) => {
  if (loading) {
    return (
      <div className="card flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-900/30 border border-red-700">
        <p className="text-red-300">Error loading reports: {error.message}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="card">
        <p className="text-center text-text-muted">
          No fire reports available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="card border border-accent-light">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">
                {report.locationName || 'Unknown Location'}
              </h3>
              <p className="text-sm text-text-muted">{report.county} County</p>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[report.status as keyof typeof statusColors] ||
                'bg-gray-500'
              }`}
            >
              {report.status}
            </div>
          </div>

          <p className="my-2">{report.description}</p>

          {report.imageUrl && (
            <div className="my-2">
              <img
                src={report.imageUrl}
                alt="Fire report"
                className="rounded-md w-full h-40 object-cover"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-3 text-sm text-text-muted">
            <div>
              <p>Severity: {report.severity}/5</p>
              <p>Reported: {new Date(report.timestamp).toLocaleString()}</p>
            </div>

            {isAdmin && onStatusUpdate && (
              <div>
                <select
                  className="select text-xs py-1"
                  value={report.status}
                  onChange={(e) => onStatusUpdate(report.id, e.target.value)}
                >
                  <option value="REPORTED">Reported</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="FALSE_ALARM">False Alarm</option>
                  <option value="CONTAINED">Contained</option>
                  <option value="EXTINGUISHED">Extinguished</option>
                </select>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FireReportList;
