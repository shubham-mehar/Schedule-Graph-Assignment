import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import mockData from '../Data/assignment-data.json';

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '5px',
    },
  };

const SchedulingGraph = () => {
  const [selectedDate, setSelectedDate] = useState(null);


    // Sort the data by item_date and then schedule_time
    mockData.sort((a, b) => {
        const dateComparison = a.item_date.localeCompare(b.item_date);
        if (dateComparison !== 0) {
        return dateComparison;
        }
        return a.schedule_time.localeCompare(b.schedule_time);
    });  

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getScheduleCountByDate = () => {
    const counts = {};
    mockData.forEach((item) => {
      const date = moment(item.item_date).format('YYYY-MM-DD');
      if (counts[date]) {
        counts[date]++;
      } else {
        counts[date] = 1;
      }
    });
    return counts;
  };

  const getScheduleCountByHour = (date) => {
    const counts = {};
    mockData.forEach((item) => {
      const itemDate = moment(item.item_date).format('YYYY-MM-DD');
      if (itemDate === date) {
        const hour = moment(item.schedule_time).hour();
        const interval = `${hour} - ${hour + 3}`;

        if (counts[interval]) {
          counts[interval]++;
        } else {
          counts[interval] = 1;
        }
      }
    });
    return counts;
  };

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM DD');
  };

  
  const formatTooltip = (value, name, props) => {
    return [`${name}: ${value}`];
  };
  
  return (
    <div style={styles.container}   className='scheduling-graph-container'>
      <h2  className='scheduling-graph1'>Scheduling Pattern Chart</h2>
      <ResponsiveContainer width="80%" height={400}>
        <LineChart
          data={Object.entries(getScheduleCountByDate()).map(([date, count]) => ({ date, count }))}
          onClick={(data) => handleDateClick(data.activeLabel)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Line type="monotone" dataKey="count" name="Scheduled" stroke="#8884d8" activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
      {selectedDate && (
        <>
          <h3  className='scheduling-graph2'>Scheduling Pattern for {selectedDate}</h3>
          <ResponsiveContainer width="70%" height={400}>
            <LineChart
              data={Object.entries(getScheduleCountByHour(selectedDate)).map(([hour, count]) => ({
                hour,
                count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="Scheduled" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default SchedulingGraph;