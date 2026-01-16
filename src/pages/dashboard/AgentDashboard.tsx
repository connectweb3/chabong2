import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import { Copy, Check, Users, Shield, Clock, UserPlus, TrendingUp, Search, ExternalLink } from 'lucide-react';
import { CreateUserModal } from '../../components/modals/CreateUserModal';
import type { Profile } from '../../types';
import clsx from 'clsx';

export const AgentDashboard = () => {
    const { session, profile } = useAuthStore();
    const [stats, setStats] = useState({ loaders: 0, users: 0 });
    const [copied, setCopied] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [requests, setRequests] = useState<any[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<Profile[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user.id) {
            fetchDownlineStats();
            fetchPendingRequests();
            fetchPendingApprovals();
        }
    }, [session]);

    const fetchDownlineStats = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('role, status')
            .eq('created_by', session?.user.id);

        if (data) {
            const counts = data.reduce((acc, curr) => {
                if (curr.role === 'loader') acc.loaders++;
                if (curr.role === 'user' && curr.status === 'active') acc.users++;
                return acc;
            }, { loaders: 0, users: 0 });
            setStats(counts);
        }
    };

    const fetchPendingRequests = async () => {
        const { data } = await supabase
            .from('transaction_requests')
            .select('*, profiles(username)')
            .eq('upline_id', session?.user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        if (data) setRequests(data);
    };

    const fetchPendingApprovals = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('created_by', session?.user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        if (data) setPendingApprovals(data as Profile[]);
    };

    const handleAction = async (requestId: string, status: 'approved' | 'rejected') => {
        setActionLoading(requestId);
        try {
            const { error } = await supabase
                .from('transaction_requests')
                .update({ status })
                .eq('id', requestId);

            if (error) throw error;
            fetchPendingRequests();
            fetchDownlineStats();
            useAuthStore.getState().refreshProfile();
        } catch (err: any) {
            console.error('Action error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleApproval = async (userId: string, status: 'active' | 'banned') => {
        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status })
                .eq('id', userId);

            if (error) throw error;
            fetchPendingApprovals();
            fetchDownlineStats();
        } catch (err: any) {
            console.error('Approval error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCopyLink = () => {
        if (!profile?.referral_code) return;
        const link = `${window.location.origin}/register?ref=${profile.referral_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 py-6 pb-24 max-w-7xl mx-auto px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight flex items-center gap-3">
                        <Shield className="text-casino-gold-400" />
                        Agent Portal
                    </h1>
                    <p className="text-casino-slate-500 mt-2 font-medium">Monitoring downline activity and player requests</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full md:w-auto btn-casino-primary py-3 px-8 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Add New Player
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-casino-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Loaders</h3>
                        <p className="text-3xl font-display font-black text-white">{stats.loaders}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-red-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-casino-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Players</h3>
                        <p className="text-3xl font-display font-black text-white">{stats.users}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-casino-gold-400/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-casino-gold-400/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-casino-gold-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-casino-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Current Volume</h3>
                        <p className="text-3xl font-display font-black text-white">₱ {profile?.credits?.toLocaleString() || '0.00'}</p>
                    </div>
                </div>
            </div>

            {/* Approvals Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                        <UserPlus size={20} className="text-casino-gold-400" />
                        Registration Queue
                    </h2>
                    {pendingApprovals.length > 0 && (
                        <span className="bg-blue-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                            {pendingApprovals.length} Pending
                        </span>
                    )}
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-casino-slate-500 text-[10px] uppercase font-black tracking-[0.15em]">
                                <tr>
                                    <th className="p-6">Player</th>
                                    <th className="p-6">Contact</th>
                                    <th className="p-6">Social</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pendingApprovals.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-casino-slate-600 font-medium italic">No pending players to approve.</td>
                                    </tr>
                                ) : (
                                    pendingApprovals.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6 font-bold text-white group-hover:text-casino-gold-400 transition-colors">{user.username}</td>
                                            <td className="p-6 text-casino-slate-300 text-sm font-bold">{user.phone_number || 'No Contact'}</td>
                                            <td className="p-6">
                                                {user.facebook_url ? (
                                                    <a
                                                        href={user.facebook_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-blue-400 hover:text-white text-[10px] font-black uppercase bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all hover:bg-blue-500"
                                                    >
                                                        Profile <ExternalLink size={10} />
                                                    </a>
                                                ) : (
                                                    <span className="text-casino-slate-600 text-xs italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-xs text-casino-slate-500 font-medium">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleApproval(user.id, 'active')}
                                                        disabled={!!actionLoading}
                                                        className="bg-casino-gold-400 text-casino-dark-950 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        {actionLoading === user.id ? '...' : 'Verify'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproval(user.id, 'banned')}
                                                        disabled={!!actionLoading}
                                                        className="bg-white/5 text-casino-slate-400 hover:text-red-400 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95"
                                                    >
                                                        Deny
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <div className="space-y-6">
                <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                    <Clock size={20} className="text-casino-gold-400" />
                    Transaction Queue
                </h2>

                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-casino-slate-500 text-[10px] uppercase font-black tracking-[0.15em]">
                                <tr>
                                    <th className="p-6">Player</th>
                                    <th className="p-6">Type</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6">Timestamp</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-casino-slate-600 font-medium italic">Queue is clear.</td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6 font-bold text-white">{req.profiles?.username}</td>
                                            <td className="p-6">
                                                <div className={clsx(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                                                    req.type === 'cash_in' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                                )}>
                                                    {req.type.replace('_', ' ')}
                                                </div>
                                            </td>
                                            <td className="p-6 font-display font-black text-casino-gold-400 text-lg">₱ {req.amount.toLocaleString()}</td>
                                            <td className="p-6 text-xs text-casino-slate-500 font-medium">{new Date(req.created_at).toLocaleString()}</td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleAction(req.id, 'approved')}
                                                        disabled={!!actionLoading}
                                                        className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95 border border-green-500/20"
                                                    >
                                                        {actionLoading === req.id ? '...' : 'Accept'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'rejected')}
                                                        disabled={!!actionLoading}
                                                        className="bg-white/5 text-casino-slate-400 hover:text-red-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Invite Hub */}
            <div className="glass-panel p-8 md:p-10 rounded-3xl border-casino-gold-400/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-10">
                    <div className="max-w-md">
                        <h3 className="text-white font-display font-black text-2xl uppercase tracking-wider mb-2">Growth Center</h3>
                        <p className="text-casino-slate-500 text-sm font-medium">Recruit new players. Players who register using your link are automatically assigned to you for lifetime commissions.</p>
                    </div>

                    <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                readOnly
                                value={profile?.referral_code ? `${window.location.origin}/register?ref=${profile.referral_code}` : 'Generating...'}
                                className="w-full bg-casino-input text-casino-slate-400 px-5 py-4 rounded-xl border border-white/5 text-xs outline-none focus:border-casino-gold-400 transition-all font-medium pr-12"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
                                <Search size={16} className="text-casino-gold-400" />
                            </div>
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className={clsx(
                                "py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg",
                                copied ? "bg-green-500 text-white" : "btn-casino-primary"
                            )}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy Invite Link'}
                        </button>
                    </div>
                </div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-casino-gold-400/5 blur-3xl rounded-full"></div>
            </div>

            {session && (
                <CreateUserModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        fetchDownlineStats();
                        setIsCreateModalOpen(false);
                    }}
                    creatorId={session.user.id}
                    allowedRoles={['user']}
                    title="Register New Player"
                />
            )}
        </div>
    );
};
