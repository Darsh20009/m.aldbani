import { AdminLayout } from "../../components/layout/AdminLayout";
import { useGetAdminStats } from "@workspace/api-client-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, Target, CalendarDays, TrendingUp,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import { SarIcon } from "@/components/ui/SarIcon";

const COLORS = ["#2563EB", "#7C3AED", "#3B82F6", "#8B5CF6", "#60A5FA", "#A78BFA"];

const StatCard = ({
  label, value, sub, subColor = "text-emerald-600", icon: Icon, iconBg,
}: {
  label: string; value: string | number | React.ReactNode; sub?: string;
  subColor?: string; icon: React.ElementType; iconBg: string;
}) => (
  <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className="text-white" />
      </div>
      <ArrowUpRight size={16} className="text-muted-foreground/50" />
    </div>
    <p className="text-2xl font-bold font-heading text-foreground tracking-tight">{value}</p>
    <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    {sub && <p className={`text-xs font-medium mt-2 ${subColor}`}>{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium inline-flex items-center gap-1">
            {p.name === "revenue" ? <>{p.value.toLocaleString()} <SarIcon size={13} /></> : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-border/60 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2].map(i => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-border/60 animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
          <AlertCircle size={32} className="text-muted-foreground/50" />
          <p>No data available.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 uppercase tracking-widest font-medium">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>All systems operational</span>
        </div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Key performance indicators and metrics at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          iconBg="bg-blue-500"
          label="Total Visitors"
          value={stats.totalVisitors.toLocaleString()}
          sub="↑ This month"
          subColor="text-blue-600"
        />
        <StatCard
          icon={Target}
          iconBg="bg-violet-500"
          label="Total Clients"
          value={stats.totalClients}
          sub={`${stats.newLeads} new leads`}
          subColor="text-violet-600"
        />
        <StatCard
          icon={CalendarDays}
          iconBg="bg-amber-500"
          label="Consultations"
          value={stats.totalConsultations}
          sub={`${stats.pendingConsultations} pending`}
          subColor="text-amber-600"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-emerald-500"
          label="Total Revenue"
          value={<span className="inline-flex items-center gap-1.5">{stats.totalRevenue.toLocaleString()} <SarIcon size={18} /></span>}
          sub="↑ Revenue tracked"
          subColor="text-emerald-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Revenue Bar Chart — wider */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Monthly Revenue</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Revenue over the past months</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full border border-blue-100">
              <SarIcon size={13} />
            </span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyRevenue} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece7" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f4f1", radius: 6 }} />
                <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart — narrower */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="font-semibold text-foreground text-sm">Consultations by Type</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Distribution across categories</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.consultationsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="type"
                  strokeWidth={0}
                >
                  {stats.consultationsByType.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-2 mt-3">
            {stats.consultationsByType.map((entry: any, index: number) => (
              <div key={entry.type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.type} <span className="font-semibold text-foreground">({entry.count})</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.pendingConsultations}</p>
            <p className="text-xs text-muted-foreground">Pending Consultations</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
            <Target size={18} className="text-violet-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.newLeads}</p>
            <p className="text-xs text-muted-foreground">New Leads</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Users size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.totalClients}</p>
            <p className="text-xs text-muted-foreground">Active Clients</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
