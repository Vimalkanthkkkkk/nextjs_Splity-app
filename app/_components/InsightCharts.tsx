"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Sector, LineChart, Line,
} from "recharts";

type Props = {
  insights: {
    summary: any;
    categories: any[];
    people: any[];
    timeline: any[];
  };
  currency : string
};

const COLORS = ["#06b6d4", "#f59e0b", "#10b981", "#6366f1", "#ef4444", "#8b5cf6"];

function Card({ title, empty, children }: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white rounded-sm p-4">
      <span className="text-black">{title}</span>
      <div className="w-full h-60 mt-2">
        {empty ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">
            No data yet
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}


export default function InsightsCharts({ insights , currency }: Props) {
    const fmt = (v: unknown) => `${currency} ${Number(v).toFixed(2)}`;
    const categoryData = insights.categories.map((c) => ({
    ...c,
    category: c.category ?? "Uncategorized",
    }));

    return (
        <div className="w-full flex flex-col gap-8">
            <Card title="Spending by Person" empty={insights.people.length === 0}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.people}>
                    <XAxis dataKey="username" />
                    <YAxis />
                    <Tooltip formatter={fmt} />
                    <Bar dataKey="amount" fill="#06b6d4" />
                </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Spending by Category" empty={categoryData.length === 0}>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={categoryData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        shape={(props) => (
                            <Sector {...props} fill={COLORS[props.index % COLORS.length]} />
                        )}
                    />
                    <Tooltip formatter={fmt} />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Spending Over Time" empty={insights.timeline.length === 0}>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights.timeline}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={fmt} />
                    <Line type="monotone" dataKey="amount" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
