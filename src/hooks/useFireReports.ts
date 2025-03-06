/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect } from 'react';
import { FireReport, CreateFireReportInput } from '../api/types';
import {
  getFireReports,
  createFireReport,
  updateFireReportStatus,
} from '../api/fireReportApi';

export function useFireReports() {
  const [reports, setReports] = useState<FireReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getFireReports();
      setReports(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (report: CreateFireReportInput) => {
    try {
      const newReport = await createFireReport(report);
      if (newReport) {
        setReports((prev) => [...prev, newReport]);
      }
      return newReport;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to create report')
      );
      return null;
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const updatedReport = await updateFireReportStatus(id, status);
      if (updatedReport) {
        setReports((prev) =>
          prev.map((report) => (report.id === id ? updatedReport : report))
        );
      }
      return updatedReport;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to update report status')
      );
      return null;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    addReport,
    updateStatus,
  };
}
