import { MarketingTool } from '../types';

export const calculateEfficiencyScore = (tools: MarketingTool[]) => {
  if (tools.length === 0) {
    return {
      overall: 0,
      costEfficiency: 0,
      usageEfficiency: 0,
      integrationEfficiency: 0,
      dataFlowEfficiency: 0,
      redundancyScore: 0
    };
  }
  
  // Calculate cost efficiency
  const totalMonthlyCost = tools.reduce((sum, tool) => {
    const normalizedCost = normalizeMonthlyRate(tool.cost, tool.billingCycle);
    return sum + normalizedCost;
  }, 0);
  
  const costPerTool = totalMonthlyCost / tools.length;
  // Lower cost per tool is better, with diminishing returns
  const costEfficiency = Math.min(10, 10 / Math.log(costPerTool + 1) * Math.log(11));
  
  // Calculate usage efficiency
  const averageUsageScore = tools.reduce((sum, tool) => sum + tool.usageScore, 0) / tools.length;
  const usageEfficiency = averageUsageScore;
  
  // Calculate integration efficiency
  const toolsWithIntegrations = tools.filter(tool => tool.integrations.length > 0);
  const integrationRatio = toolsWithIntegrations.length / tools.length;
  const integrationEfficiency = integrationRatio * 10;
  
  // Calculate data flow efficiency
  const toolsWithDataFlow = tools.filter(tool => tool.dataFlow !== 'none');
  const dataFlowRatio = toolsWithDataFlow.length / tools.length;
  const dataFlowEfficiency = dataFlowRatio * 10;
  
  // Calculate redundancy score
  const categories = new Set(tools.map(tool => tool.category));
  const categoryCount = categories.size;
  const toolsPerCategory = tools.length / categoryCount;
  // Lower tools per category is better (less redundancy)
  const redundancyScore = Math.max(0, 10 - (toolsPerCategory - 1) * 2);
  
  // Calculate overall score (weighted average)
  const overall = (
    costEfficiency * 0.25 +
    usageEfficiency * 0.2 +
    integrationEfficiency * 0.2 +
    dataFlowEfficiency * 0.2 +
    redundancyScore * 0.15
  );
  
  return {
    overall,
    costEfficiency,
    usageEfficiency,
    integrationEfficiency,
    dataFlowEfficiency,
    redundancyScore
  };
};

export const generateRecommendations = (tools: MarketingTool[]) => {
  const recommendations = {
    consolidation: [] as { category: string; tools: string[]; recommendation: string }[],
    newTools: [] as { category: string; recommendation: string }[],
    costSaving: [] as { tool: string; recommendation: string }[],
    integration: [] as { tool: string; recommendation: string }[]
  };
  
  if (tools.length === 0) {
    return recommendations;
  }
  
  // Group tools by category
  const toolsByCategory: Record<string, MarketingTool[]> = {};
  tools.forEach(tool => {
    if (!toolsByCategory[tool.category]) {
      toolsByCategory[tool.category] = [];
    }
    toolsByCategory[tool.category].push(tool);
  });
  
  // Check for consolidation opportunities
  Object.entries(toolsByCategory).forEach(([category, categoryTools]) => {
    if (categoryTools.length > 1) {
      const toolNames = categoryTools.map(tool => tool.name);
      const categoryName = getCategoryName(category);
      
      recommendations.consolidation.push({
        category: categoryName,
        tools: toolNames,
        recommendation: `Consider consolidating ${toolNames.join(', ')} into a single ${categoryName.toLowerCase()} solution to reduce redundancy and costs.`
      });
    }
  });
  
  // Check for missing categories
  const essentialCategories = ['crm', 'analytics', 'email', 'data'];
  const missingCategories = essentialCategories.filter(category => !toolsByCategory[category]);
  
  missingCategories.forEach(category => {
    const categoryName = getCategoryName(category);
    
    recommendations.newTools.push({
      category: categoryName,
      recommendation: `Consider adding a ${categoryName} tool to your stack to improve your marketing capabilities.`
    });
  });
  
  // Check for cost saving opportunities
  tools.forEach(tool => {
    const normalizedCost = normalizeMonthlyRate(tool.cost, tool.billingCycle);
    
    if (normalizedCost > 500 && tool.usageScore < 5) {
      recommendations.costSaving.push({
        tool: tool.name,
        recommendation: `${tool.name} has a high cost but low usage score. Consider evaluating its ROI or negotiating better pricing.`
      });
    }
    
    if (tool.billingCycle === 'monthly' && tool.cost > 100) {
      recommendations.costSaving.push({
        tool: tool.name,
        recommendation: `Consider switching ${tool.name} to annual billing to potentially save on subscription costs.`
      });
    }
  });
  
  // Check for integration improvements
  tools.forEach(tool => {
    if (tool.integrations.length === 0) {
      recommendations.integration.push({
        tool: tool.name,
        recommendation: `${tool.name} has no integrations. Consider connecting it to your data warehouse to improve data flow.`
      });
    }
    
    if (tool.dataFlow === 'none') {
      recommendations.integration.push({
        tool: tool.name,
        recommendation: `${tool.name} has no data flow. Establish data connections to maximize its value in your stack.`
      });
    }
  });
  
  return recommendations;
};

// Helper function to normalize costs to monthly rate
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

// Helper function to get category name
const getCategoryName = (categoryId: string): string => {
  const categories: Record<string, string> = {
    crm: 'CRM',
    analytics: 'Analytics',
    email: 'Email Marketing',
    advertising: 'Advertising',
    social: 'Social Media',
    content: 'Content Management',
    data: 'Data Warehouse',
    other: 'Other'
  };
  
  return categories[categoryId] || categoryId;
};