// C:\MIH_Web\frontend\web-site\app\about\page.tsx

import React from 'react';
import AboutBanner from '@/components/About/AboutBanner';
import MissionVision from '@/components/About/MissionVision';
import HospitalHistory from '@/components/About/HospitalHistory';
import LeadershipTeam from '@/components/About/LeadershipTeam';
import QualityAccreditations from '@/components/About/QualityAccreditations';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      
      {/* 1. بانر الصفحة */}
      <AboutBanner />

      {/* 2. الرؤية والرسالة والقيم */}
      <MissionVision />
      
      {/* 3. تاريخ المستشفى */}
      <HospitalHistory />

      {/* 4. فريق القيادة */}
      <LeadershipTeam />

      {/* 5. الجودة والاعتمادات */}
      <QualityAccreditations />
      
    </div>
  );
}