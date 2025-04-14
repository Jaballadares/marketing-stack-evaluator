import React, { useRef, useEffect } from 'react';
import { MarketingTool } from '../types';

interface IntegrationMapProps {
  tools: MarketingTool[];
}

const IntegrationMap: React.FC<IntegrationMapProps> = ({ tools }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || tools.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = Math.max(500, tools.length * 60);
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find data warehouse tool or create a virtual one
    const dataWarehouse = tools.find((tool) => tool.category === 'data') || {
      name: 'Data Warehouse',
      category: 'data',
      id: 'virtual-dw',
    };

    // Draw data warehouse
    const warehouseX = canvas.width * 0.5;
    const warehouseY = canvas.height * 0.5;
    const warehouseRadius = 80;

    ctx.beginPath();
    ctx.arc(warehouseX, warehouseY, warehouseRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#4299E1'; // blue-500
    ctx.fill();

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dataWarehouse.name, warehouseX, warehouseY);

    // Draw tools and connections
    const otherTools = tools.filter(
      (tool) => tool.id !== dataWarehouse.id && tool.category !== 'data'
    );
    const angleStep = (Math.PI * 2) / Math.max(6, otherTools.length);

    otherTools.forEach((tool, index) => {
      const angle = index * angleStep;
      const distance = 200;
      const x = warehouseX + Math.cos(angle) * distance;
      const y = warehouseY + Math.sin(angle) * distance;
      const radius = 50;

      // Draw tool circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      // Color based on category
      const categoryColors: Record<string, string> = {
        crm: '#48BB78', // green-500
        analytics: '#F6AD55', // orange-400
        email: '#F56565', // red-500
        advertising: '#9F7AEA', // purple-500
        social: '#ED64A6', // pink-500
        content: '#ECC94B', // yellow-500
        other: '#A0AEC0', // gray-500
      };

      ctx.fillStyle = categoryColors[tool.category] || '#A0AEC0';
      ctx.fill();

      // Draw tool name
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tool.name, x, y);

      // Draw connection line
      ctx.beginPath();

      // Calculate start and end points on the circles' edges
      const startAngle = Math.atan2(warehouseY - y, warehouseX - x);
      const endAngle = Math.atan2(y - warehouseY, x - warehouseX);

      const startX = x + Math.cos(startAngle) * radius;
      const startY = y + Math.sin(startAngle) * radius;
      const endX = warehouseX + Math.cos(endAngle) * warehouseRadius;
      const endY = warehouseY + Math.sin(endAngle) * warehouseRadius;

      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);

      // Line style based on data flow
      ctx.lineWidth = 2;

      switch (tool.dataFlow) {
        case 'inbound':
          ctx.strokeStyle = '#48BB78'; // green-500
          ctx.setLineDash([]);
          break;
        case 'outbound':
          ctx.strokeStyle = '#F56565'; // red-500
          ctx.setLineDash([]);
          break;
        case 'bidirectional':
          ctx.strokeStyle = '#4299E1'; // blue-500
          ctx.setLineDash([]);
          break;
        default:
          ctx.strokeStyle = '#A0AEC0'; // gray-500
          ctx.setLineDash([5, 5]);
          break;
      }

      ctx.stroke();

      // Draw arrow for data flow
      if (tool.dataFlow !== 'none') {
        const drawArrow = (
          fromX: number,
          fromY: number,
          toX: number,
          toY: number
        ) => {
          const headLength = 10;
          const dx = toX - fromX;
          const dy = toY - fromY;
          const angle = Math.atan2(dy, dx);

          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        };

        // Calculate midpoint for arrow
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        if (tool.dataFlow === 'inbound' || tool.dataFlow === 'bidirectional') {
          // Arrow pointing to tool
          ctx.fillStyle = '#48BB78'; // green-500
          drawArrow(endX, endY, midX, midY);
        }

        if (tool.dataFlow === 'outbound' || tool.dataFlow === 'bidirectional') {
          // Arrow pointing to warehouse
          ctx.fillStyle = '#F56565'; // red-500
          drawArrow(startX, startY, midX, midY);
        }
      }
    });
  }, [tools]);

  if (tools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>
          No tools added yet. Add tools in the Tool Inventory tab to see the
          integration map.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Integration Map</h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <p className="text-gray-600">
            This map visualizes how your marketing tools integrate with your
            data warehouse.
          </p>
        </div>

        <div className="overflow-auto">
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ minHeight: '500px' }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Data Warehouse</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Inbound Data</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Outbound Data</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Bidirectional</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationMap;
