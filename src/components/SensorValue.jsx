import React from 'react'

const SensorValue = () => {
  const cards = [
    { title: "Temperature", value: "28°C", color: "bg-blue-500" },
    { title: "Humidity", value: "74%", color: "bg-green-500" },
    { title: "Soil moisture", value: "76%", color: "bg-purple-500" },
    { title: "NPK", value: "85.24 mg/kg", color: "bg-red-500" },
  ]
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Crop Name</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-md p-6 text-white ${card.color}`}
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SensorValue
