/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FireMap from '../components/FireMap';
import ReportForm from '../components/ReportForm';
import { CreateFireReportInput } from '../api/types';
import { createFireReport } from '../api/fireReportApi';

interface ReportPageProps {
  userId: string;
}

const ReportPage: React.FC<ReportPageProps> = ({ userId }) => {
  const [selectedLocation, setSelectedLocation] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSubmit = async (report: CreateFireReportInput) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createFireReport(report);

      if (!result) {
        throw new Error('Failed to create report');
      }

      // Show success message and redirect to dashboard
      alert('Fire report submitted successfully!');
      navigate('/');
    } catch (err) {
      setSubmitError('Failed to submit report. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Report a Wildfire</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Select Location on Map</h2>
            <p className="text-text-muted mb-4">
              Click on the map to select the location of the fire you're
              reporting.
            </p>
            <div className="h-[400px] w-full">
              <FireMap reports={[]} zoom={7} onMapClick={handleMapClick} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Reporting Guidelines</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li>
                Be as accurate as possible when selecting the fire location
              </li>
              <li>Provide a detailed description of what you see</li>
              <li>Include landmarks or reference points if possible</li>
              <li>
                Rate the severity based on visible flames, smoke, and spread
              </li>
              <li>If possible, upload or link to a photo of the fire</li>
              <li>Stay safe and do not put yourself in danger to report</li>
            </ul>
          </div>
        </div>

        <div>
          <ReportForm
            onSubmit={handleSubmit}
            selectedLocation={selectedLocation}
            userId={userId}
          />

          {submitError && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
              <p className="text-red-300">{submitError}</p>
            </div>
          )}

          {isSubmitting && (
            <div className="mt-4 p-3 bg-background-light rounded-md flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-3"></div>
              <p>Submitting your report...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
