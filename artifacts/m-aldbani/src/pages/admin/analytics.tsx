import { AdminLayout } from "../../components/layout/AdminLayout";
import { useGetAnalytics } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 gap-6 mb-8">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) return <AdminLayout><div>No analytics data available.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2 text-white">Analytics</h1>
        <p className="text-foreground/60">Platform traffic, engagement, and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-foreground/60 text-sm font-medium mb-2">Page Views</h3>
          <p className="text-3xl font-bold font-mono text-white">{analytics.pageViews.toLocaleString()}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-foreground/60 text-sm font-medium mb-2">Unique Visitors</h3>
          <p className="text-3xl font-bold font-mono text-white">{analytics.uniqueVisitors.toLocaleString()}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-foreground/60 text-sm font-medium mb-2">Avg Session</h3>
          <p className="text-3xl font-bold font-mono text-white">{Math.floor(analytics.avgSessionDuration / 60)}m {analytics.avgSessionDuration % 60}s</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-foreground/60 text-sm font-medium mb-2">Bounce Rate</h3>
          <p className="text-3xl font-bold font-mono text-white">{analytics.bounceRate}%</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl mb-8">
        <h3 className="text-lg font-bold font-heading mb-6 text-white">Daily Visitors (Last 30 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.dailyVisitors}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', color: '#fff' }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#2563EB" fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-bold font-heading mb-6 text-white">Top Pages</h3>
          <div className="space-y-4">
            {analytics.topPages.map((page, i) => (
              <div key={i} className="flex justify-between items-center pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <span className="text-white/80 font-mono text-sm">{page.path}</span>
                <span className="font-bold text-white">{page.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-bold font-heading mb-6 text-white">Traffic Sources</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.trafficSources} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="type" type="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
