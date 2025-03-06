/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { CreateFireReportInput, FireReport } from './types';

const client = generateClient<Schema>();

export const getFireReports = async (): Promise<FireReport[]> => {
  try {
    const { data, errors } = await client.models.FireReport.list();
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error('Error fetching fire reports:', error);
    return [];
  }
};

export const getFireReportsByCounty = async (
  county: string
): Promise<FireReport[]> => {
  try {
    const { data, errors } = await client.models.FireReport.list({
      filter: { county: { eq: county } },
    });
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error(`Error fetching fire reports for county ${county}:`, error);
    return [];
  }
};

export const createFireReport = async (
  input: CreateFireReportInput
): Promise<FireReport | null> => {
  try {
    const { data, errors } = await client.models.FireReport.create(input);
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error('Error creating fire report:', error);
    return null;
  }
};

export const updateFireReportStatus = async (
  id: string,
  status: string
): Promise<FireReport | null> => {
  try {
    const { data, errors } = await client.models.FireReport.update({
      id,
      status,
    });
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error('Error updating fire report status:', error);
    return null;
  }
};
