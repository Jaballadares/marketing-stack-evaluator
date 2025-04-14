import React from 'react';
import { MarketingTool } from '../types';

interface RecommendationsProps {
  recommendations: {
    consolidation: {
      category: string;
      tools: string[];
      recommendation: string;
    }[];
    newTools: {
      category: string;
      recommendation: string;
    }[];
    costSaving: {
      tool: string;
      recommendation: string;
    }[];
    integration: {
      tool: string;
      recommendation: string;
    }[];
  };
  tools: MarketingTool[];
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  tools,
}) => {
  if (tools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>
          No tools added yet. Add tools in the Tool Inventory tab to see
          recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recommendations</h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">
          Consolidation Opportunities
        </h3>
        {recommendations.consolidation.length > 0 ? (
          <div className="space-y-4">
            {recommendations.consolidation.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-medium">{item.category}</div>
                <div className="text-sm text-gray-600 mb-2">
                  Tools: {item.tools.join(', ')}
                </div>
                <p>{item.recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No consolidation opportunities identified.
          </p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Suggested New Tools</h3>
        {recommendations.newTools.length > 0 ? (
          <div className="space-y-4">
            {recommendations.newTools.map((item, index) => (
              <div
                key={index}
                className="border-l-4 border-green-500 pl-4 py-2"
              >
                <div className="font-medium">{item.category}</div>
                <p>{item.recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No new tools recommended at this time.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">
            Cost Saving Opportunities
          </h3>
          {recommendations.costSaving.length > 0 ? (
            <div className="space-y-4">
              {recommendations.costSaving.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-yellow-500 pl-4 py-2"
                >
                  <div className="font-medium">{item.tool}</div>
                  <p>{item.recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No cost saving opportunities identified.
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Integration Improvements</h3>
          {recommendations.integration.length > 0 ? (
            <div className="space-y-4">
              {recommendations.integration.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-purple-500 pl-4 py-2"
                >
                  <div className="font-medium">{item.tool}</div>
                  <p>{item.recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No integration improvements identified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
