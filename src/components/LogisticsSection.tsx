import React from 'react';
import { Terminal, Truck, Lock, RotateCcw } from 'lucide-react';
import { AppConfig } from '../types';

interface LogisticsSectionProps {
  logisticsData: AppConfig['logistics'];
  primaryColor: string;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  logisticsData,
  primaryColor,
}) => {
  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'terminal':
        return <Terminal className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
      case 'local_shipping':
      case 'truck':
        return <Truck className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
      case 'lock':
        return <Lock className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
      case 'rotate_left':
      case 'rotateccw':
        return <RotateCcw className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
      default:
        return <Terminal className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
    }
  };

  return (
    <section className="bg-[#0e0e0e] py-16 border-y-2 border-[#514532]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="font-headline-lg text-3xl sm:text-4xl uppercase mb-10 text-center font-bold text-white tracking-tight">
          {logisticsData.sectionTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {logisticsData.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-6 bg-[#131313] border-2 border-[#514532] hover:border-[#ffb800] transition-colors"
            >
              <div className="mb-4">{renderIcon(item.icon)}</div>
              <h4 className="font-label-mono text-white font-bold uppercase tracking-widest text-sm mb-1">
                {item.title}
              </h4>
              <p
                className="font-label-mono text-[11px] uppercase tracking-wider font-bold"
                style={{ color: primaryColor }}
              >
                {item.cmd}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
