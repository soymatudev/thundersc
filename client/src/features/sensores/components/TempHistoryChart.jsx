import React from 'react';
import {dayjs} from 'dayjs';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#22d3ee', '#3b82f6', '#f97316', '#ef4444', '#10b981', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl text-sm">
                <p className="text-gray-400 mb-1">{new Date(label).toLocaleString()}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-200">{entry.name}:</span>
                        <span className="font-mono font-bold text-white">
                            {Number(entry.value).toFixed(2)}°C
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const TempHistoryChart = ({ data }) => {
    // Transform data: group by timestamp, with keys as 'sensorName' or 'sensorId'
    // But backend returns flat list: { cve_equipo, sensor_nombre, fecha_hora, dato_1, dato_2 }

    // We need to pivot the data for Recharts:
    // [ { timestamp: '...', 'Sensor 1': 20.5, 'Sensor 2': 15.0 }, ... ]

    // 1. Get unique sensor names
    
    const sensors = [...new Set(data.map(d => d.sensor_nombre))];

    // 2. Pivot
    // We can group by timestamp string, but we must be careful with slight time diffs if no downsampling.
    // If downsampling is ON, timestamps will align perfectly (hourly).
    // If NOT, they might misalign. Syncing axes might be tricky if data points don't align.
    // Recharts handles different x-values if we use type="number" on XAxis, but simpler is category/time.

    // Let's group by timestamp string equality.
    const grouped = data.reduce((acc, curr) => {
        const timeKey = dayjs(curr.fecha_hora).millisecond(0);
        if (!acc[timeKey]) {
            acc[timeKey] = { timestamp: curr.fecha_hora };
        }
        acc[timeKey][curr.sensor_nombre] = Number(curr.dato_1);
        return acc;
    }, {});

    /* const chartData = Object.values(grouped).sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    ); */

    const chartData = Object.values(grouped).sort((a, b) =>
        dayjs(a.timestamp).toDate() - dayjs(b.timestamp).toDate()
    );

    return (
        <div className="w-full h-[350px] bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 pl-2 border-l-4 border-indigo-500">
                Histórico de Temperatura
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    syncId="sensorHistory"
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        stroke="#9ca3af"
                        tickFormatter={(str) => {
                            const date = dayjs(str).toDate();
                            return date.getHours().toString().padStart(2, '0') + ':' +
                                date.getMinutes().toString().padStart(2, '0');
                        }}
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        unit="°C"
                        style={{ fontSize: '12px' }}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    {sensors.map((sensor, index) => (
                        <Line
                            key={sensor}
                            type="monotone"
                            dataKey={sensor}
                            stroke={COLORS[index % COLORS.length]}
                            dot={false}
                            activeDot={{ r: 6 }}
                            strokeWidth={2}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TempHistoryChart;
