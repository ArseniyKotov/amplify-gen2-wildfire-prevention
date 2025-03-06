/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState } from 'react';
import { CreateFireReportInput } from '../api/types';

interface ReportFormProps {
  onSubmit: (report: CreateFireReportInput) => Promise<void>;
  selectedLocation?: { lat: number; lng: number };
  userId: string;
}

const ReportForm: React.FC<ReportFormProps> = ({
  onSubmit,
  selectedLocation,
  userId,
}) => {
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [county, setCounty] = useState('');
  const [severity, setSeverity] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      setError('Please select a location on the map first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const report: CreateFireReportInput = {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        description,
        locationName,
        county,
        severity,
        imageUrl: imageUrl || undefined,
        reporterId: userId,
        timestamp: new Date().toISOString(),
        status: 'REPORTED',
      };

      await onSubmit(report);

      // Reset form
      setDescription('');
      setLocationName('');
      setCounty('');
      setSeverity(1);
      setImageUrl('');
    } catch (err) {
      setError('Failed to submit report. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Report a Wildfire</h2>

      {selectedLocation ? (
        <div className="mb-4 p-2 bg-accent-light rounded-md">
          <p className="text-sm">
            Selected Location: {selectedLocation.lat.toFixed(6)},{' '}
            {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      ) : (
        <div className="mb-4 p-2 bg-accent-light rounded-md">
          <p className="text-sm text-yellow-400">
            Click on the map to select a location
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="locationName" className="label">
            Location Name
          </label>
          <input
            type="text"
            id="locationName"
            className="input w-full"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g., Griffith Park"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="county" className="label">
            County
          </label>
          <select
            id="county"
            className="select w-full"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            required
          >
            <option value="">Select County</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="San Francisco">San Francisco</option>
            <option value="San Diego">San Diego</option>
            <option value="Orange">Orange</option>
            <option value="Alameda">Alameda</option>
            <option value="Sacramento">Sacramento</option>
            <option value="Fresno">Fresno</option>
            <option value="Santa Clara">Santa Clara</option>
            <option value="Riverside">Riverside</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            className="input w-full h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you see (smoke, flames, etc.)"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="severity" className="label">
            Severity (1-5)
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="severity"
              min="1"
              max="5"
              step="1"
              className="w-full h-2 bg-accent-light rounded-lg appearance-none cursor-pointer"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
            />
            <span className="ml-2 text-lg font-bold">{severity}</span>
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>Minor</span>
            <span>Severe</span>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="label">
            Image URL (optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            className="input w-full"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || !selectedLocation}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
