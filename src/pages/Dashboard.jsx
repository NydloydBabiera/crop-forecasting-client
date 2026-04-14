import React from "react";
import SensorValue from "../components/SensorValue";
import TimeScheduleSetter from "../components/TimeScheduleSetter";
import FarmerInformation from "../components/FarmerInformation";

const Dashboard = () => {
  return (
    <div className="mt-16 px-6 pb-10 min-h-screen w-full">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          Crop Monitoring Dashboard
        </h1>
        <p className="text-slate-400 text-sm">
          Real-time sensor insights & scheduling
        </p>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-12 gap-6 w-full">
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
            <TimeScheduleSetter />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
            <FarmerInformation isReport={true} />
          </div>
        </div>
      </div>

      {/* SENSOR SECTION */}
      <div className="mt-8 w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
          <SensorValue />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
