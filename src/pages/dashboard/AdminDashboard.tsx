import { useNavigate } from 'react-router-dom';
import { Users, Activity, DollarSign, Settings, Gamepad2, FileText, Globe, Trophy, Info } from 'lucide-react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { useStreamSettings } from '../../hooks/useStreamSettings';
import { StatCard } from '../../components/dashboard/StatCard';
import { RoleAnalyticsCard } from '../../components/dashboard/RoleAnalyticsCard';
import { AdminUserManagement } from './AdminUserManagement';

export const AdminDashboard = () => {
    const { stats } = useAdminStats();
    const { streamUrl, updateStreamUrl } = useStreamSettings();
    const navigate = useNavigate();

    return (
        <div className="space-y-10 py-6 pb-24 max-w-7xl mx-auto px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight flex items-center gap-3">
                        <Trophy className="text-casino-gold-400" />
                        Admin Dashboard
                    </h1>
                    <p className="text-casino-slate-500 mt-2 font-medium flex items-center gap-2">
                        <Activity size={14} className="text-green-500" />
                        System is currently operational
                    </p>
                </div>
                <button className="w-full md:w-auto btn-casino-primary py-3 px-8 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                    <Gamepad2 size={18} />
                    Manage Matches
                </button>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Population"
                    value={stats.totalUsers.toLocaleString()}
                    icon={<Users size={20} />}
                />
                <StatCard
                    title="Active Bets"
                    value={stats.totalBetsToday.toLocaleString()}
                    icon={<Activity size={20} />}
                    trend="+12%"
                    trendUp={true}
                />
                <StatCard
                    title="System Liquidity"
                    value={`₱${Object.values(stats.roleCredits).reduce((a, b) => a + b, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    icon={<DollarSign size={20} />}
                    className="border-red-500/10"
                />
                <StatCard
                    title="System Nodes"
                    value="Online"
                    icon={<Globe size={20} />}
                    className="border-green-500/10 text-green-400"
                />
            </div>

            {/* Role Analytics Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                        <Users size={20} className="text-casino-gold-400" />
                        Network Distribution
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RoleAnalyticsCard
                        roleName="Master Agents"
                        count={stats.roleCounts.master_agent}
                        totalCredits={stats.roleCredits.master_agent}
                        colorClass="bg-purple-500"
                        onClick={() => navigate('/users?role=master_agent')}
                    />
                    <RoleAnalyticsCard
                        roleName="Agents"
                        count={stats.roleCounts.agent}
                        totalCredits={stats.roleCredits.agent}
                        colorClass="bg-blue-500"
                        onClick={() => navigate('/users?role=agent')}
                    />
                    <RoleAnalyticsCard
                        roleName="Loaders"
                        count={stats.roleCounts.loader}
                        totalCredits={stats.roleCredits.loader}
                        colorClass="bg-casino-gold-400"
                        onClick={() => navigate('/users?role=loader')}
                    />
                    <RoleAnalyticsCard
                        roleName="Players"
                        count={stats.roleCounts.user}
                        totalCredits={stats.roleCredits.user}
                        colorClass="bg-green-500"
                        onClick={() => navigate('/users?role=user')}
                    />
                </div>
            </div>

            {/* Control Center Quick Links */}
            <div className="space-y-6">
                <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                    <Settings size={20} className="text-casino-gold-400" />
                    Quick Operations
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/users')} className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-white/10 hover:bg-white/5 transition-all group active:scale-95">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users size={24} className="text-blue-400" />
                        </div>
                        <span className="text-xs font-black text-casino-slate-300 uppercase tracking-widest">Users</span>
                    </button>
                    <button onClick={() => navigate('/transactions')} className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-white/10 hover:bg-white/5 transition-all group active:scale-95">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText size={24} className="text-yellow-400" />
                        </div>
                        <span className="text-xs font-black text-casino-slate-300 uppercase tracking-widest">Logs</span>
                    </button>
                    <button onClick={() => navigate('/betting')} className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-white/10 hover:bg-white/5 transition-all group active:scale-95">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Gamepad2 size={24} className="text-red-400" />
                        </div>
                        <span className="text-xs font-black text-casino-slate-300 uppercase tracking-widest">Operation</span>
                    </button>
                    <button onClick={() => navigate('/settings')} className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-white/10 hover:bg-white/5 transition-all group active:scale-95">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Settings size={24} className="text-purple-400" />
                        </div>
                        <span className="text-xs font-black text-casino-slate-300 uppercase tracking-widest">Settings</span>
                    </button>
                </div>
            </div>

            {/* Stream Configuration Section */}
            <div className="glass-panel rounded-2xl p-6 md:p-10 border-casino-gold-400/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                            <Activity className="text-casino-gold-400" />
                            Broadcasting Settings
                        </h2>
                        <p className="text-casino-slate-500 text-sm mt-1">Configure live stream sources for all players</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-casino-gold-400 uppercase tracking-[0.2em] ml-1">Stream Source URL</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="https://..."
                                className="w-full bg-casino-input text-white px-5 py-4 rounded-xl focus:border-casino-gold-400 outline-none transition-all placeholder-casino-slate-600 border border-white/5"
                                defaultValue={streamUrl}
                                onChange={(e) => updateStreamUrl(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Activity className="text-casino-gold-400 animate-pulse w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-[10px] text-casino-slate-500 font-medium px-1">
                            <Info size={12} className="mt-0.5" />
                            <span>Player supports HLS (.m3u8), YouTube, and VOD links. Updates are applied in real-time.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Management Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                        <Users size={20} className="text-casino-gold-400" />
                        User Management
                    </h2>
                </div>
                <div className="glass-panel rounded-2xl p-2 md:p-6 overflow-hidden">
                    <AdminUserManagement />
                </div>
            </div>
        </div>
    );
};
