import React, { useState } from 'react';
import { MarketingTool, Category } from '../types';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CostAnalysisProps {
  tools: MarketingTool[];
  categories: Category[];
}

const CostAnalysis: React.FC<CostAnalysisProps> = ({ tools, categories }) => {
  const [viewType, setViewType] = useState<'category' | 'tool'>('category');

  // Normalize costs to monthly for comparison
  const normalizeMonthlyRate = (cost: number, billingCycle: string): number => {
    switch (billingCycle) {
      case 'monthly':
        return cost;
      case 'quarterly':
        return cost / 3;
      case 'annually':
        return cost / 12;
      case 'oneTime':
        return cost / 12; // Amortize one-time costs over a year
      default:
        return cost;
    }
  };

  // Calculate total monthly cost
  const totalMonthlyCost = tools.reduce((sum, tool) => {
    return sum + normalizeMonthlyRate(tool.cost, tool.billingCycle);
  }, 0);

  // Calculate costs by category
  const costsByCategory = categories
    .map((category) => {
      const categoryTools = tools.filter(
        (tool) => tool.category === category.id
      );
      const categoryCost = categoryTools.reduce((sum, tool) => {
        return sum + normalizeMonthlyRate(tool.cost, tool.billingCycle);
      }, 0);

      return {
        category: category.name,
        cost: categoryCost,
      };
    })
    .filter((item) => item.cost > 0);

  // Calculate costs by tool (top 10)
  const costsByTool = tools
    .map((tool) => ({
      tool: tool.name,
      cost: normalizeMonthlyRate(tool.cost, tool.billingCycle),
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 10);

  // Prepare chart data
  const pieData = {
    labels: costsByCategory.map((item) => item.category),
    datasets: [
      {
        data: costsByCategory.map((item) => item.cost),
        backgroundColor: [
          '#4299E1', // blue-500
          '#48BB78', // green-500
          '#F6AD55', // orange-400
          '#F56565', // red-500
          '#9F7AEA', // purple-500
          '#ED64A6', // pink-500
          '#ECC94B', // yellow-500
          '#A0AEC0', // gray-500
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels:
      viewType === 'category'
        ? costsByCategory.map((item) => item.category)
        : costsByTool.map((item) => item.tool),
    datasets: [
      {
        label: 'Monthly Cost ($)',
        data:
          viewType === 'category'
            ? costsByCategory.map((item) => item.cost)
            : costsByTool.map((item) => item.cost),
        backgroundColor: '#4299E1',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: viewType === 'category' ? 'Cost by Category' : 'Cost by Tool',
      },
    },
  };

  if (tools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>
          No tools added yet. Add tools in the Tool Inventory tab to see cost
          analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cost Analysis</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('category')}
            className={`px-3 py-1 rounded ${
              viewType === 'category'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setViewType('tool')}
            className={`px-3 py-1 rounded ${
              viewType === 'tool'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By Tool
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">Total Monthly Cost</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${totalMonthlyCost.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Normalized to monthly billing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Cost Distribution</h3>
          <div className="h-64">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">
            {viewType === 'category'
              ? 'Cost by Category'
              : 'Top 10 Tools by Cost'}
          </h3>
          <div className="h-64">
            <Bar options={barOptions} data={barData} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {viewType === 'category' ? 'Category' : 'Tool'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(viewType === 'category' ? costsByCategory : costsByTool).map(
                (item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {viewType === 'category' ? item.category : item.tool}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {((item.cost / totalMonthlyCost) * 100).toFixed(1)}%
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysis;
