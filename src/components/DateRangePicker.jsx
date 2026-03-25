// src/components/DateRangePicker.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";

/**
 * A reusable component for selecting a date range.
 * @param {function} onDateRangeChange - Callback function with (startDate, endDate)
 */
const DateRangePicker = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Helper to handle date changes and trigger the parent's filter function
  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange(start, end); // Call the parent's filter function
  };

  return (
    // <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
    <div className="w-64 ">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Filter By Date Range
      </label>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
        isClearable={true}
        dateFormat="MMM dd, yyyy"
        placeholderText="Select Date Range"
        className="w-64 px-2 py-1 rounded border border-gray-300"
      />
    </div>
  );
};

export default DateRangePicker;
