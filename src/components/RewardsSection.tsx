import React from 'react';
import { Key, Terminal, Ticket, Gift, ShieldCheck } from 'lucide-react';
import { AppConfig } from '../types';

interface RewardsSectionProps {
  rewardsData: AppConfig['rewards'];
  primaryColor: string;
}

export const RewardsSection: React.FC<RewardsSectionProps> = ({
  rewardsData,
  primaryColor,
}) => {
  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'key':
        return <Key className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
      case 'terminal':
        return <Terminal className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
      case 'token':
      case 'ticket':
        return <Ticket className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
      default:
        return <Gift className="text-[#ffb800]" size={36} style={{ color: primaryColor }} />;
    }
  };

  return (
    <section className="bg-[#1c1b1b] py-16 md:py-20 border-b-2 border-[#514532]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center gap-2 mb-10">
          <ShieldCheck className="text-[#ffb800]" size={24} style={{ color: primaryColor }} />
          <h2 className="font-headline-lg text-3xl sm:text-4xl uppercase text-white font-bold text-center tracking-tight">
            {rewardsData.sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewardsData.items.map((item) => (
            <div
              key={item.id}
              className="bg-[#20201f] border-2 border-[#514532] p-6 hover-lift transition-all brutalist-border"
            >
              <div className="mb-4">{renderIcon(item.icon)}</div>
              <h4 className="font-headline-lg text-xl uppercase mb-2 text-white font-bold tracking-tight">
                {item.title}
              </h4>
              <p className="text-[#d5c4ab] font-body-md text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
