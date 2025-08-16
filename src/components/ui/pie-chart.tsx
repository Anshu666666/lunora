import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from 'recharts';
import React, { useEffect, useState } from 'react';
type TooltipPayload = ReadonlyArray<any>;

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: any;
  };

const RADIAN = Math.PI / 180;
const COLORS = ['#10b981', '#8b5cf6', '#f8fafc', '#fbbf24', '#ec4899', '#3b82f6'];

export default function Example() {
  const [data, setData] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    fetch("/api/tracking/songs-by-genre")
      .then(res => res.json())
      .then(res => {
        setData(res.chartData);
        setTotalMinutes(res.totalMinutes);
        console.log("Pie chart data:", res.chartData);
        console.log("Total minutes:", res.totalMinutes)
      });
  }, []);
  return (
    <>
    <div className="text-white text-center text-2xl mt-5 mb-3 font-semibold">
        Listening Time by Category ({totalMinutes.toFixed(1)} min)
      </div> 
    <ResponsiveContainer className="flex justify-center items-center w-full" height="80%">
           
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          //   label={renderCustomizedLabel}
          outerRadius={120}
          innerRadius={90}
          cornerRadius={5}
          paddingAngle={3}
          isAnimationActive={true}
          animationDuration={2200}
          dataKey="value"
        >
          {data.map((entry, index) => (
            // FIX: Added a unique key for each item in the iterator.
            <Cell key={`cell-${index}`} stroke='none' fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />

      </PieChart>
    </ResponsiveContainer>
    </>
  );
}