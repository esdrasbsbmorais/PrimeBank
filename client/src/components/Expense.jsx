import React from 'react';
import { Container } from '@mui/material';
import dynamic from 'next/dynamic';

const PieChart = dynamic(
  () => import('@mui/x-charts/PieChart').then(mod => mod.PieChart),
  { ssr: false }
);

export default function Expense() {
  const data = [
    { id: 0, value: 100, color: '#D3C645' },
    { id: 1, value: 150, color: '#D0C517' },
    { id: 2, value: 200, color: '#E5E472' },
    { id: 3, value: 200, color: '#B3B588' }
  ];

  return (
    <Container>
      <div style={{ height: '200px', width: '100%' }}>
        <PieChart
          series={[{ data: data, innerRadius: 70, outerRadius: 100, paddingAngle: 5, cornerRadius: 5, startAngle: -90, endAngle: 90, cx: 150, cy: 150 }]}
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: 14,
                fill: 'white',
              },
            },
          }}
        />
      </div>
    </Container>
  );
}
