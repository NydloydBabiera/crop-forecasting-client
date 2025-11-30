import React from "react";
import DateRangePicker from "../components/DateRangePicker";

const Reports = () => {
  return (
    <div className="p-4 mt-24 border-4 border-red-500">
      <p className="text-3xl uppercase">Reports</p>
      <DateRangePicker />
      
    </div>
  );
};

export default Reports;
