import React from 'react'
import SensorValue from '../components/SensorValue'
import TimeScheduleSetter from '../components/TimeScheduleSetter'

const Dashboard = () => {
  return (
    <div className="mt-24 w-full">
      <TimeScheduleSetter />
      <SensorValue />
    </div>
  )
}

export default Dashboard
