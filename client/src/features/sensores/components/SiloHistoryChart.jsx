import React from 'react';
import dayjs from 'dayjs';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#10b981', '#34d399', '#059669', '#064e3b'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-emerald-700/50 p-3 rounded-lg shadow-xl text-sm">
                <p className="text-gray-400 mb-1 border-b border-gray-800 pb-1">
                    {dayjs(label).format('DD MMM, HH:mm')}
                </p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-300">{entry.name}:</span>
                        <span className="font-mono font-bold text-emerald-400">
                            {Number(entry.value).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const SiloHistoryChart = ({ data }) => {
    const sensors = [...new Set(data.filter(d => d.cve_unidad === 'SIL').map(d => d.sensor_nombre))];

    // Pivot data for Recharts
    const grouped = data.reduce((acc, curr) => {
        if (curr.cve_unidad !== 'SIL') return acc;
        const timeKey = dayjs(curr.fecha_hora).format('YYYY-MM-DD HH:mm:ss');
        if (!acc[timeKey]) {
            acc[timeKey] = { timestamp: curr.fecha_hora };
        }
        acc[timeKey][curr.sensor_nombre] = Number(curr.dato_1); // En Silo, dato_1 es el nivel
        return acc;
    }, {});

    const chartData = Object.values(grouped).sort((a, b) =>
        dayjs(a.timestamp).toDate() - dayjs(b.timestamp).toDate()
    );

    if (sensors.length === 0) return null;

    return (
        <div className="w-full h-[400px] bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                    <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                    Historial de Llenado de Silos
                </h3>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700/30">
                    Operación
                </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    syncId="sensorHistory"
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        {sensors.map((sensor, index) => (
                            <linearGradient key={`grad-${sensor}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.3} />
                    <XAxis
                        dataKey="timestamp"
                        stroke="#6b7280"
                        tickFormatter={(str) => dayjs(str).format('HH:mm')}
                        style={{ fontSize: '11px', fontWeight: 'bold' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#6b7280"
                        unit="%"
                        style={{ fontSize: '11px', fontWeight: 'bold' }}
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    {sensors.map((sensor, index) => (
                        <Area
                            key={sensor}
                            type="monotone"
                            dataKey={sensor}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#color-${index})`}
                            connectNulls
                            activeDot={{ r: 6, stroke: '#111827', strokeWidth: 2 }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SiloHistoryChart;
