import React, { useEffect, useState, useMemo, useCallback  } from 'react';
import {
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    LabelList,
    Area,
    ResponsiveContainer,
  } from 'recharts';

const PhPrediction = () => {
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
      // Fetch data immediately on mount
      fetchData();

      // Then fetch data every minute
      const intervalId = setInterval(fetchData, 60 * 1000);

      // Clear interval on unmount
      return () => clearInterval(intervalId);
    }, []);

    const fetchData = async () => {
      try {
          const predictionsRes = await fetch(`/api/realm/predictions/ph`);
          const predictionsJson = await predictionsRes.json();
          
          if (predictionsRes.ok) {
              setPredictions(predictionsJson);
          } else {
              console.error('Server responded with:', predictionsJson);
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };
  

  const processPredictedData = useCallback(() => {
    if (!predictions || Object.keys(predictions).length === 0) return [];

    const startingHour = new Date().getHours();

    return predictions.values.map((value, index) => {
        const totalHours = startingHour + index * 2;
        const calculatedHour = totalHours % 12;
        const displayHour = calculatedHour === 0 ? 12 : calculatedHour;
        const period = totalHours >= 24 || totalHours < 12 ? 'AM' : 'PM';  // This line handles the AM/PM switch correctly
        
        return {
            hour: `${displayHour} ${period}`,
            predictedPh: parseFloat(value.toFixed(2))
        };
    });
}, [predictions]);
  

    const processedData = useMemo(() => {
        return processPredictedData();
    }, [processPredictedData]);

    console.log(processedData);

    const CustomXAxisTick = ({ x, y, payload }) => {
        const hour = payload.value;
        const handleButtonClick = () => {
            console.log('Button clicked:', hour);
        };
      

      return (
            <g transform={`translate(${x},${y})`}>
                <foreignObject width={80} height={40} x={-40}>
                    <button
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent',
                            color: 'white',
                            fontWeight: '200',
                            fontSize: '0.7rem',
                            border: 'none',
                            textTransform: 'uppercase',
                            fontFamily: 'Poppins'
                        }}
                        onClick={handleButtonClick}
                    >
                        {hour}
                    </button>
                </foreignObject>
            </g>
        );
    };

    return (
        <div style={{ width: '100%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer>
                <AreaChart data={processedData}>
                    <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        height={50}
                        interval={0}
                        tick={<CustomXAxisTick />}
                        padding={{ left: 30, right: 30 }}
                    />
                    <YAxis axisLine={false}
                        tick={false}
                        width={0}
                    />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="predictedPh"
                        name="Predicted Average Reading"
                        stroke="#F5D087"
                        fill="#F5D087"
                        fillOpacity={0.3}
                        dot={{ r: 3 }}
                        >
                        <LabelList dataKey="predictedPh" position="top"
                                    style={{ fontFamily: 'Poppins', fontSize: '0.7rem'}} />
                    </Area>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PhPrediction