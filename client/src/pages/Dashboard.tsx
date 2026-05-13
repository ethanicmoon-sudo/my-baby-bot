import { useState } from 'react';
import { useLocation } from 'wouter';
import Sidebar from '@/components/Sidebar';
import WarRoom from '@/components/modules/WarRoom';
import FactoryRoom from '@/components/modules/FactoryRoom';
import ResearchLab from '@/components/modules/ResearchLab';
import CommunicationHub from '@/components/modules/CommunicationHub';
import MediaBay from '@/components/modules/MediaBay';
import FeedbackLoop from '@/components/modules/FeedbackLoop';
import Archives from '@/components/modules/Archives';
import RevenueD from '@/components/modules/RevenueD';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeModule, setActiveModule] = useState('war-room');

  const renderModule = () => {
    switch (activeModule) {
      case 'war-room':
        return <WarRoom />;
      case 'factory-room':
        return <FactoryRoom />;
      case 'research-lab':
        return <ResearchLab />;
      case 'communication':
        return <CommunicationHub />;
      case 'media-bay':
        return <MediaBay />;
      case 'feedback':
        return <FeedbackLoop />;
      case 'archives':
        return <Archives />;
      case 'revenue':
        return <RevenueD />;
      default:
        return <WarRoom />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Scanning line effect */}
      <div className="scan-line fixed top-0 left-0 right-0 z-50 pointer-events-none" />
      
      {/* Sidebar Navigation */}
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        
        {/* Module Content */}
        <div className="relative z-10">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}
