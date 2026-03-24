import React from 'react'
import SensorValue from '../components/SensorValue'
import TimeScheduleSetter from '../components/TimeScheduleSetter'
import FarmerInformation from '../components/FarmerInformation'

const Dashboard = () => {
  return (
    <div className="mt-24 px-6 space-y-6">
      
      {/* TOP ROW */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Time Schedule (Left) */}
        <div className="col-span-8">
          <TimeScheduleSetter />
        </div>
  
        {/* Farmer Info (Right) */}
        <div className="col-span-4">
          <FarmerInformation />
        </div>
  
      </div>
  
      {/* BOTTOM (Full Width) */}
      <div>
        <SensorValue />
      </div>
  
    </div>
  );
}

export default Dashboard
