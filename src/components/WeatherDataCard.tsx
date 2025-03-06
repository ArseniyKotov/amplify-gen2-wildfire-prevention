/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React from 'react';
import { WeatherData } from '../api/types';

interface WeatherDataCardProps {
  data: WeatherData;
}

const getFireRiskColor = (riskIndex: number | undefined) => {
  if (!riskIndex) return 'bg-gray-500';

  if (riskIndex < 0.3) return 'bg-green-500';
  if (riskIndex < 0.5) return 'bg-yellow-500';
  if (riskIndex < 0.7) return 'bg-orange-500';
  return 'bg-red-500';
};

const WeatherDataCard: React.FC<WeatherDataCardProps> = ({ data }) => {
  return (
    <div className="card border border-accent-light">
      <div className="flex justify-between items-start">
        <h3 className="font-bold">{data.county} County</h3>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${getFireRiskColor(
            data.fireRiskIndex
          )}`}
        >
          Risk: {data.fireRiskIndex ? Math.round(data.fireRiskIndex * 100) : 0}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div>
          <p className="text-sm text-text-muted">Temperature</p>
          <p className="font-medium">{data.temperature}°F</p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Humidity</p>
          <p className="font-medium">{data.humidity}%</p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Wind Speed</p>
          <p className="font-medium">{data.windSpeed} mph</p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Wind Direction</p>
          <p className="font-medium">{data.windDirection}°</p>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-3">
        Updated: {new Date(data.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default WeatherDataCard;
