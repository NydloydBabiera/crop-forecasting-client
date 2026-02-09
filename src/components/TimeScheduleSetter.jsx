import React from "react";
import { useState, useEffect } from "react";

const TimeScheduleSetter = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; // optional env usage

  // GET API
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/getScheduledReading`);
      const result = await res.json();
      console.log("🚀 ~ fetchData ~ result:", result);
      setData(result);
    } catch (err) {
      console.error("GET error:", err);
    }
  };

  // POST API
  const handleSubmit = async () => {
    if (!value) return;

    try {
      await fetch(`${API_URL}/addScheduleReading`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeCount: Number(value) }),
      });

      setValue("");
      fetchData(); // refresh list after submit
    } catch (err) {
      console.error("POST error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-md space-y-4">
      {/* Input + Button */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter minutes"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white
                       hover:bg-blue-700 active:scale-95"
        >
          Save
        </button>
      </div>

      {/* Display GET API values */}
      <div className="rounded-lg border p-3">
        <h3 className="mb-2 font-semibold">Scheduled Readings</h3>
        {data.length === 0 ? (
          <p className="text-sm text-gray-500">No data</p>
        ) : (
          <li
            key={data.schedule_id}
            className="flex justify-between rounded bg-gray-100 px-2 py-1"
          >
            <span>Every {data.time_count} minutes</span>
            <span className="text-gray-500">{data?.is_active}</span>
          </li>
          //   <ul className="space-y-1 text-sm">
          //     <li
          //       key={data.schedule_id}
          //       className="flex justify-between rounded bg-gray-100 px-2 py-1"
          //     >
          //       <span>Every {data.time_count} minutes</span>
          //       <span className="text-gray-500">{data?.is_active}</span>
          //     </li>
          //     {/* {data.map((item) => (
          //       <li
          //         key={item.id}
          //         className="flex justify-between rounded bg-gray-100 px-2 py-1"
          //       >
          //         <span>{item.interval_minutes} minutes</span>
          //         <span className="text-gray-500">{item?.status}</span>
          //       </li>
          //     ))} */}
          //   </ul>
        )}
      </div>
    </div>
  );
};

export default TimeScheduleSetter;
