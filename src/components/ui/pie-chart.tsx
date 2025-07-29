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
const COLORS = ['#22c55e', '#8b5cf6', '#6b7280', '#f59e0b', '#ec4899', '#3b82f6']
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
//   const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

//   return (
//     <text 
//       x={x} 
//       y={y} 
//       fill="white" 
//       textAnchor="middle" 
//       dominantBaseline="central"
//       fontSize="12px"
//       fontWeight="bold"
//     >
//       <tspan x={x} dy="0">{name}</tspan>
//       <tspan x={x} dy="15">{`${((percent ?? 1) * 100).toFixed(0)}%`}</tspan>
//     </text>
//   );
// };

export default function Example() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/tracking/songs-by-genre")
      .then(res => res.json())
      .then(res => {
        setData(res.chartData);
        setTotal(res.totalSongs);
        console.log("Pie chart data:", res.chartData);
        console.log(res.totalSongs)
      });
  }, []);
  return (
    <>
    <div className="text-white text-center text-2xl mt-5 mb-3 font-semibold">
        Songs by Category ({total})
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
            <Cell stroke='none' fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />

      </PieChart>
    </ResponsiveContainer>
    </>
  );
}
