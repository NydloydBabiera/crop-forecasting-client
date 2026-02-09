import React, { useState } from 'react'

const DateRangeCombobox = ({setDateRange }) => {
    const [selected, setSelected] = useState("today");

    const handleChange = (value) => {
      setSelected(value);
  
      const now = new Date();
      let start, end;
  
      if (value === "today") {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
      }
  
      if (value === "weekly") {
        const firstDayOfWeek = new Date(now);
        const lastDayOfWeek = new Date(now);
  
        const day = now.getDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = day === 0 ? -6 : 1 - day;
  
        firstDayOfWeek.setDate(now.getDate() + diffToMonday);
        firstDayOfWeek.setHours(0, 0, 0, 0);
  
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);
  
        start = firstDayOfWeek;
        end = lastDayOfWeek;
      }
  
      if (value === "monthly") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
  
      setDateRange({
        startDate: start,
        endDate: end,
      });
    };
  
    return (
      <div className="w-64 ">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Date Range
        </label>
  
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Today</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
        </select>
      </div>
    );
}

export default DateRangeCombobox
