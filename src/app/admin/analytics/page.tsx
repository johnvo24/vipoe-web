'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '@/components/admin/stat-card';
import { TrendingUp, Users, Eye, MousePointer } from 'lucide-react';

const visitorData = [
  { month: 'Jan', visitors: 4000 },
  { month: 'Feb', visitors: 3000 },
  { month: 'Mar', visitors: 5000 },
  { month: 'Apr', visitors: 2780 },
  { month: 'May', visitors: 1890 },
  { month: 'Jun', visitors: 2390 },
  { month: 'Jul', visitors: 3490 },
  { month: 'Aug', visitors: 4200 },
  { month: 'Sep', visitors: 3800 },
  { month: 'Oct', visitors: 4100 },
  { month: 'Nov', visitors: 4500 },
  { month: 'Dec', visitors: 5000 },
];

const categoryData = [
  { name: 'Electronics', value: 400, color: '#3b82f6' },
  { name: 'Clothing', value: 300, color: '#06b6d4' },
  { name: 'Food', value: 200, color: '#10b981' },
  { name: 'Books', value: 150, color: '#f59e0b' },
];

const deviceData = [
  { device: 'Desktop', sessions: 3200 },
  { device: 'Mobile', sessions: 4500 },
  { device: 'Tablet', sessions: 1200 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-1))',
  },
  sessions: {
    label: 'Sessions',
    color: 'hsl(var(--chart-2))',
  },
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your website performance and user behavior
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Page Views"
          value="124,592"
          change="+12.5% from last month"
          changeType="positive"
          icon={Eye}
        />
        <StatCard
          title="Unique Visitors"
          value="48,231"
          change="+8.2% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Bounce Rate"
          value="32.4%"
          change="-3.1% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Avg. Session"
          value="4m 32s"
          change="+15s from last month"
          changeType="positive"
          icon={MousePointer}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={visitorData}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={deviceData}>
                <XAxis
                  dataKey="device"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="sessions"
                  fill="var(--color-sessions)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={categoryData}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.value} sales
                    </p>
                  </div>
                  <span className="font-semibold">
                    {(
                      (category.value /
                        categoryData.reduce((acc, cat) => acc + cat.value, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
