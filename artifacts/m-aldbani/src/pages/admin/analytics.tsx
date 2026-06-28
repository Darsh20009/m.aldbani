import { AdminLayout } from "../../components/layout/AdminLayout";
import { useGetAnalytics } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Eye, Users, Clock, TrendingDown, AlertCircle } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 text-sm">
        {label && <p className="font-semibold text-foreground mb-1">{label}</p>}
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.value?.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 gap-5 mb-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-border/60 animate-pulse" />)}
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
          <AlertCircle size={32} className="opacity-40" />
          <p className="text-sm">No analytics data available.</p>
        </div>
      </AdminLayout>
    );
  }

  const kpis = [
    { label: "Page Views", value: analytics.pageViews.toLocaleString(), icon: Eye, iconBg: "bg-blue-500" },
    { label: "Unique Visitors", value: analytics.uniqueVisitors.toLocaleString(), icon: Users, iconBg: "bg-violet-500" },
    { label: "Avg Session", value: `${Math.floor(analytics.avgSessionDuration / 60)}m ${Math.round(analytics.avgSessionDuration % 60)}s`, icon: Clock, iconBg: "bg-amber-500" },
    { label: "Bounce Rate", value: `${analytics.bounceRate}%`, icon: TrendingDown, iconBg: "bg-rose-500" },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform traffic, engagement, and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpis.map(({ label, value, icon: Icon, iconBg }) => (
          <div key={label} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground font-heading">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm mb-5">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground text-sm">Daily Visitors (Last 7 Days)</h3>
          <p className="text-xs text-muted-foreground">Traffic trend over the past week</p>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.dailyVisitors}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece7" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="visitors" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
          <h3 className="font-semibold text-foreground text-sm mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analytics.topPages.map((page: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-border/40 last:border-0 last:pb-0">
                <span className="text-foreground/70 font-mono text-sm">{page.path}</span>
                <span className="font-bold text-foreground text-sm">{page.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
          <h3 className="font-semibold text-foreground text-sm mb-4">Traffic Sources</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.trafficSources} layout="vertical" margin={{ top: 0, right: 10, left: 50, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece7" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="type" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f4f1" }} />
                <Bar dataKey="count" fill="#7C3AED" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
