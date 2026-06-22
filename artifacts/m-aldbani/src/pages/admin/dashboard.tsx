import { AdminLayout } from "../../components/layout/AdminLayout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#2563EB', '#7C3AED', '#3B82F6', '#8B5CF6', '#60A5FA', '#A78BFA'];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      </AdminLayout>
    );
  }

  if (!stats) return <AdminLayout><div>No data available.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2 text-white">Dashboard Overview</h1>
        <p className="text-white/60">Key performance indicators and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-xl border-t-4 border-t-primary">
          <h3 className="text-white/60 text-sm font-medium mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold font-mono text-white">{stats.totalVisitors.toLocaleString()}</p>
        </div>
        <div className="glass-card p-6 rounded-xl border-t-4 border-t-secondary">
          <h3 className="text-white/60 text-sm font-medium mb-2">Total Clients</h3>
          <p className="text-3xl font-bold font-mono text-white">{stats.totalClients}</p>
        </div>
        <div className="glass-card p-6 rounded-xl border-t-4 border-t-blue-400">
          <h3 className="text-white/60 text-sm font-medium mb-2">Consultations</h3>
          <p className="text-3xl font-bold font-mono text-white">{stats.totalConsultations}</p>
          <p className="text-xs text-yellow-400 mt-2">{stats.pendingConsultations} pending</p>
        </div>
        <div className="glass-card p-6 rounded-xl border-t-4 border-t-green-400">
          <h3 className="text-white/60 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold font-mono text-white">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-2">{stats.newLeads} new leads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-bold font-heading mb-6 text-white">Monthly Revenue</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', color: '#fff' }}
                  itemStyle={{ color: '#2563EB' }}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-bold font-heading mb-6 text-white">Consultations by Type</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.consultationsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="type"
                >
                  {stats.consultationsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {stats.consultationsByType.map((entry, index) => (
                <div key={entry.type} className="flex items-center gap-2 text-sm text-white/70">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.type} ({entry.count})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
