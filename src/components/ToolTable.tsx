import React from 'react';
import { MarketingTool, Category } from '../types';

interface ToolTableProps {
  tools: MarketingTool[];
  categories: Category[];
  onEdit: (tool: MarketingTool) => void;
  onDelete: (id: string) => void;
}

const ToolTable: React.FC<ToolTableProps> = ({
  tools,
  categories,
  onEdit,
  onDelete
}) => {
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  const formatCost = (cost: number, billingCycle: string): string => {
    return `$${cost.toFixed(2)} ${billingCycle}`;
  };
  
  const getUsageFrequencyLabel = (frequency: string): string => {
    const labels: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      rarely: 'Rarely'
    };
    return labels[frequency] || frequency;
  };
  
  const getDataFlowLabel = (dataFlow: string): string => {
    const labels: Record<string, string> = {
      inbound: 'Inbound',
      outbound: 'Outbound',
      bidirectional: 'Bidirectional',
      none: 'None'
    };
    return labels[dataFlow] || dataFlow;
  };

  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tool
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Flow
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tools.map(tool => (
            <tr key={tool.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{tool.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getCategoryName(tool.category)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatCost(tool.cost, tool.billingCycle)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>{getUsageFrequencyLabel(tool.usageFrequency)}</div>
                <div className="text-sm text-gray-500">Score: {tool.usageScore}/10</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>{getDataFlowLabel(tool.dataFlow)}</div>
                <div className="text-sm text-gray-500">
                  {tool.integrations.length > 0 
                    ? `${tool.integrations.length} integrations` 
                    : 'No integrations'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(tool)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${tool.name}?`)) {
                      onDelete(tool.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToolTable;