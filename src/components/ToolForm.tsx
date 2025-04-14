import React, { useState } from 'react';
import { MarketingTool, Category } from '../types';

interface ToolFormProps {
  categories: Category[];
  initialTool: MarketingTool | null;
  onSubmit: (tool: MarketingTool) => void;
  onCancel: () => void;
}

const ToolForm: React.FC<ToolFormProps> = ({
  categories,
  initialTool,
  onSubmit,
  onCancel
}) => {
  const [tool, setTool] = useState<MarketingTool>(
    initialTool || {
      id: '',
      name: '',
      category: '',
      cost: 0,
      billingCycle: 'monthly',
      usageFrequency: 'daily',
      usageScore: 5,
      integrations: [],
      dataFlow: 'bidirectional'
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cost') {
      setTool({ ...tool, [name]: parseFloat(value) || 0 });
    } else if (name === 'usageScore') {
      setTool({ ...tool, [name]: parseInt(value) || 0 });
    } else if (name === 'integrations') {
      // Handle integrations as a comma-separated list
      setTool({ ...tool, [name]: value.split(',').map(item => item.trim()) });
    } else {
      setTool({ ...tool, [name]: value });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tool);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">
        {initialTool ? 'Edit Tool' : 'Add New Tool'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tool Name
          </label>
          <input
            type="text"
            name="name"
            value={tool.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={tool.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost
          </label>
          <input
            type="number"
            name="cost"
            value={tool.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Cycle
          </label>
          <select
            name="billingCycle"
            value={tool.billingCycle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
            <option value="oneTime">One-time</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usage Frequency
          </label>
          <select
            name="usageFrequency"
            value={tool.usageFrequency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="rarely">Rarely</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usage Score (1-10)
          </label>
          <input
            type="range"
            name="usageScore"
            value={tool.usageScore}
            onChange={handleChange}
            min="1"
            max="10"
            className="w-full"
          />
          <div className="text-center">{tool.usageScore}</div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Integrations (comma-separated)
          </label>
          <input
            type="text"
            name="integrations"
            value={tool.integrations.join(', ')}
            onChange={handleChange}
            placeholder="Data warehouse, CRM, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Flow
          </label>
          <select
            name="dataFlow"
            value={tool.dataFlow}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="inbound">Inbound (receives data)</option>
            <option value="outbound">Outbound (sends data)</option>
            <option value="bidirectional">Bidirectional</option>
            <option value="none">No data flow</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {initialTool ? 'Update Tool' : 'Add Tool'}
        </button>
      </div>
    </form>
  );
};

export default ToolForm;