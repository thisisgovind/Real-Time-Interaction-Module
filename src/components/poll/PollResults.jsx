
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend, PieChart as RePieChart, Pie } from 'recharts';
import { PieChart, BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-effect p-3 rounded-md shadow-lg">
        <p className="label text-emphasis font-semibold">{data.fullOptionName || label}</p>
        <p className="text-sm text-subtle">{`${data.votes} votes (${data.percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabelForPie = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent * 100 < 5) return null; 

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const PollResults = ({ votes, totalVotes, options }) => {
  const [chartType, setChartType] = useState('bar');

  const chartColors = useMemo(() => [
    'hsl(var(--primary))', 
    'hsl(var(--secondary))', 
    'hsl(var(--accent))', 
    'hsl(30, 70%, 60%)',
    'hsl(120, 50%, 60%)',
    'hsl(180, 60%, 55%)',
    'hsl(330, 70%, 65%)',
    'hsl(60, 70%, 50%)'
  ], []);

  const chartData = useMemo(() => {
    if (!votes || !options) return [];
    return votes.map((vote, index) => ({
      name: options[index]?.length > 15 ? options[index].substring(0, 12) + '...' : options[index],
      fullOptionName: options[index],
      votes: vote.count,
      percentage: totalVotes > 0 ? parseFloat(((vote.count / totalVotes) * 100).toFixed(1)) : 0,
      fill: chartColors[index % chartColors.length]
    }));
  }, [votes, totalVotes, options, chartColors]);

  return (
    <Card className="glass-effect p-6 sm:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-emphasis flex items-center">
          <PieChart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary"/>
          Live Results
        </h2>
        <div className="flex gap-2">
            <Button variant={chartType === 'bar' ? 'secondary': 'outline'} size="sm" onClick={() => setChartType('bar')} aria-label="Show bar chart">
                <BarChart2 className="w-4 h-4"/>
            </Button>
            <Button variant={chartType === 'pie' ? 'secondary': 'outline'} size="sm" onClick={() => setChartType('pie')} aria-label="Show pie chart">
                <PieChart className="w-4 h-4"/>
            </Button>
        </div>
      </div>
      
      {totalVotes === 0 ? (
        <div className="text-center text-subtle py-12 h-64 sm:h-72 flex flex-col justify-center items-center flex-grow">
          <BarChart2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-30 text-primary" />
          <p>Waiting for the first votes to come in...</p>
        </div>
      ) : (
        <div className="space-y-6 flex-grow flex flex-col">
          <div className="h-64 sm:h-72 flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <ReBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
                    width={70} 
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsla(var(--primary)/0.1)'}}/>
                  <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </ReBarChart>
              ) : (
                <RePieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabelForPie}
                        outerRadius={"80%"}
                        fill="#8884d8"
                        dataKey="votes"
                        nameKey="name"
                    >
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value, entry) => <span className="text-emphasis text-xs">{entry.payload.name}</span>} />
                </RePieChart>
              )}
            </ResponsiveContainer>
          </div>
          {chartType === 'bar' && (
            <div className="space-y-2 sm:space-y-3 pt-4 border-t border-border">
              {chartData.sort((a,b) => b.votes - a.votes).map((item, index) => (
                <motion.div
                  key={item.fullOptionName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, type: "spring", stiffness: 100 }}
                  className="flex items-center justify-between p-2 sm:p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-emphasis font-medium text-xs sm:text-sm">{item.fullOptionName}</span>
                  </div>
                  <div className="text-emphasis text-xs sm:text-sm">
                    <span className="font-bold">{item.votes}</span>
                    <span className="text-subtle ml-2">({item.percentage}%)</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center pt-4 border-t border-border mt-auto">
            <p className="text-subtle">
              Total Votes: <span className="font-bold text-emphasis">{totalVotes}</span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PollResults;
