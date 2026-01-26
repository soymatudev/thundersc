import React from 'react';
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
                            {Number(entry.value).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const HumHistoryChart = ({ data }) => {
    const sensors = [...new Set(data.map(d => d.sensor_nombre))];

    const grouped = data.reduce((acc, curr) => {
        const timeKey = new Date(curr.fecha_hora).getTime();
        if (!acc[timeKey]) {
            acc[timeKey] = { timestamp: curr.fecha_hora };
        }
        acc[timeKey][curr.sensor_nombre] = Number(curr.dato_2); // dato_2 is Humidity
        return acc;
    }, {});

    const chartData = Object.values(grouped).sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    return (
        <div className="w-full h-[350px] bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 pl-2 border-l-4 border-cyan-500">
                Histórico de Humedad
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
                            const date = new Date(str);
                            return date.getHours().toString().padStart(2, '0') + ':' +
                                date.getMinutes().toString().padStart(2, '0');
                        }}
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        unit="%"
                        style={{ fontSize: '12px' }}
                        domain={[0, 100]}
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

export default HumHistoryChart;
