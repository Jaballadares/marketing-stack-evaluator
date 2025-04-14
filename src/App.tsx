import React, { useState } from 'react';
import { useStore } from './store';
import ToolInventory from './components/ToolInventory';
import CostAnalysis from './components/CostAnalysis';
import IntegrationMap from './components/IntegrationMap';
import EfficiencyScore from './components/EfficiencyScore';
import Recommendations from './components/Recommendations';
import Tabs from './components/Tabs';
import { calculateEfficiencyScore, generateRecommendations } from './utils/analysis';
import { MarketingTool, Category } from './types';

const App: React.FC = () => {
  const { tools, setState } = useStore();
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Categories for marketing tools
  const categories: Category[] = [
    { id: 'crm', name: 'CRM' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'email', name: 'Email Marketing' },
    { id: 'advertising', name: 'Advertising' },
    { id: 'social', name: 'Social Media' },
    { id: 'content', name: 'Content Management' },
    { id: 'data', name: 'Data Warehouse' },
    { id: 'other', name: 'Other' }
  ];
  
  const addTool = (tool: MarketingTool) => {
    const updatedTools = [...tools, { ...tool, id: Date.now().toString() }];
    setState('tools', updatedTools);
  };
  
  const updateTool = (updatedTool: MarketingTool) => {
    const updatedTools = tools.map(tool => 
      tool.id === updatedTool.id ? updatedTool : tool
    );
    setState('tools', updatedTools);
  };
  
  const deleteTool = (id: string) => {
    const updatedTools = tools.filter(tool => tool.id !== id);
    setState('tools', updatedTools);
  };
  
  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setState('tools', []);
    }
  };
  
  // Calculate efficiency score
  const efficiencyScore = calculateEfficiencyScore(tools);
  
  // Generate recommendations
  const recommendations = generateRecommendations(tools);
  
  const tabs = [
    { id: 'inventory', label: 'Tool Inventory' },
    { id: 'costs', label: 'Cost Analysis' },
    { id: 'integration', label: 'Integration Map' },
    { id: 'efficiency', label: 'Efficiency Score' },
    { id: 'recommendations', label: 'Recommendations' }
  ];

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <button 
          onClick={resetData}
          className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
        >
          Reset Data
        </button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {activeTab === 'inventory' && (
          <ToolInventory 
            tools={tools} 
            categories={categories} 
            onAddTool={addTool} 
            onUpdateTool={updateTool} 
            onDeleteTool={deleteTool} 
          />
        )}
        
        {activeTab === 'costs' && (
          <CostAnalysis tools={tools} categories={categories} />
        )}
        
        {activeTab === 'integration' && (
          <IntegrationMap tools={tools} />
        )}
        
        {activeTab === 'efficiency' && (
          <EfficiencyScore 
            tools={tools} 
            efficiencyScore={efficiencyScore} 
          />
        )}
        
        {activeTab === 'recommendations' && (
          <Recommendations 
            recommendations={recommendations} 
            tools={tools}
          />
        )}
      </div>
    </div>
  );
};

export default App;