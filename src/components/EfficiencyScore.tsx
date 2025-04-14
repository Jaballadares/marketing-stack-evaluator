import React from 'react';
import { MarketingTool } from '../types';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface EfficiencyScoreProps {
  tools: MarketingTool[];
  efficiencyScore: {
    overall: number;
    costEfficiency: number;
    usageEfficiency: number;
    integrationEfficiency: number;
    dataFlowEfficiency: number;
    redundancyScore: number;
  };
}

const EfficiencyScore: React.FC<EfficiencyScoreProps> = ({
  tools,
  efficiencyScore,
}) => {
  const radarData = {
    labels: [
      'Cost Efficiency',
      'Usage Efficiency',
      'Integration Efficiency',
      'Data Flow Efficiency',
      'Redundancy Score',
    ],
    datasets: [
      {
        label: 'Current Stack',
        data: [
          efficiencyScore.costEfficiency,
          efficiencyScore.usageEfficiency,
          efficiencyScore.integrationEfficiency,
          efficiencyScore.dataFlowEfficiency,
          efficiencyScore.redundancyScore,
        ],
        backgroundColor: 'rgba(66, 153, 225, 0.2)',
        borderColor: 'rgba(66, 153, 225, 1)',
        borderWidth: 2,
      },
      {
        label: 'Ideal Stack',
        data: [10, 10, 10, 10, 10],
        backgroundColor: 'rgba(72, 187, 120, 0.1)',
        borderColor: 'rgba(72, 187, 120, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Average';
    if (score >= 2) return 'Poor';
    return 'Critical';
  };

  if (tools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>
          No tools added yet. Add tools in the Tool Inventory tab to see
          efficiency scores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Efficiency Score</h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h3 className="text-lg font-medium mb-2">Overall Efficiency Score</h3>
        <div
          className={`text-5xl font-bold mb-2 ${getScoreColor(
            efficiencyScore.overall
          )}`}
        >
          {efficiencyScore.overall.toFixed(1)}/10
        </div>
        <p className="text-gray-600">
          {getScoreDescription(efficiencyScore.overall)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Efficiency Breakdown</h3>
          <div className="h-64">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Score Details</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Cost Efficiency</span>
                <span className={getScoreColor(efficiencyScore.costEfficiency)}>
                  {efficiencyScore.costEfficiency.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${efficiencyScore.costEfficiency * 10}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Usage Efficiency</span>
                <span
                  className={getScoreColor(efficiencyScore.usageEfficiency)}
                >
                  {efficiencyScore.usageEfficiency.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${efficiencyScore.usageEfficiency * 10}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Integration Efficiency</span>
                <span
                  className={getScoreColor(
                    efficiencyScore.integrationEfficiency
                  )}
                >
                  {efficiencyScore.integrationEfficiency.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{
                    width: `${efficiencyScore.integrationEfficiency * 10}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Data Flow Efficiency</span>
                <span
                  className={getScoreColor(efficiencyScore.dataFlowEfficiency)}
                >
                  {efficiencyScore.dataFlowEfficiency.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{
                    width: `${efficiencyScore.dataFlowEfficiency * 10}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Redundancy Score</span>
                <span
                  className={getScoreColor(efficiencyScore.redundancyScore)}
                >
                  {efficiencyScore.redundancyScore.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${efficiencyScore.redundancyScore * 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyScore;
