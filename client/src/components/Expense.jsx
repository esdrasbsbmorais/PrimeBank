import React from 'react';
import { Container } from '@mui/material';
import dynamic from 'next/dynamic';

const PieChart = dynamic(
  () => import('@mui/x-charts/PieChart').then(mod => mod.PieChart),
  { ssr: false }
);

export default function Expense() {
  const data = [
    { id: 0, value: 100, label: 'series A', color: '#2f6a63' },
    { id: 1, value: 150, label: 'series B', color: '#13a274' },
    { id: 2, value: 200, label: 'series C', color: '#bbdea6' },
    { id: 3, value: 200, label: 'series D', color: '#546666' }
  ];

  return (
    <Container>
      <h1 className="text-white">Gráfico de Despesas</h1>
      <div style={{ height: '500px', width: '100%' }}>
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
