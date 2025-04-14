import React, { useState } from 'react';
import { MarketingTool, Category } from '../types';
import ToolForm from './ToolForm';
import ToolTable from './ToolTable';

interface ToolInventoryProps {
  tools: MarketingTool[];
  categories: Category[];
  onAddTool: (tool: MarketingTool) => void;
  onUpdateTool: (tool: MarketingTool) => void;
  onDeleteTool: (id: string) => void;
}

const ToolInventory: React.FC<ToolInventoryProps> = ({
  tools,
  categories,
  onAddTool,
  onUpdateTool,
  onDeleteTool
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<MarketingTool | null>(null);
  
  const handleAddClick = () => {
    setEditingTool(null);
    setShowForm(true);
  };
  
  const handleEditClick = (tool: MarketingTool) => {
    setEditingTool(tool);
    setShowForm(true);
  };
  
  const handleFormSubmit = (tool: MarketingTool) => {
    if (editingTool) {
      onUpdateTool(tool);
    } else {
      onAddTool(tool);
    }
    setShowForm(false);
    setEditingTool(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTool(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Marketing Tool Inventory</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Tool
        </button>
      </div>
      
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <ToolForm
            categories={categories}
            initialTool={editingTool}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
      
      <ToolTable
        tools={tools}
        categories={categories}
        onEdit={handleEditClick}
        onDelete={onDeleteTool}
      />
      
      {tools.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p className="mb-4">No marketing tools added yet.</p>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Your First Tool
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolInventory;