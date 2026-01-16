import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import { UserPlus, Copy, Check, Users, TrendingUp, Clock, ShieldCheck, Search, ExternalLink, Phone } from 'lucide-react';
import { CreateUserModal } from '../../components/modals/CreateUserModal';
import type { Profile } from '../../types';
import clsx from 'clsx';

export const MasterAgentDashboard = () => {
    const { session, profile } = useAuthStore();
    const [downlineCount, setDownlineCount] = useState({ agents: 0, users: 0 });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createType, setCreateType] = useState<'agent' | 'user'>('agent');
    const [copied, setCopied] = useState(false);

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
            const stats = data.reduce((acc, curr) => {
                if (curr.role === 'agent') acc.agents++;
                if (curr.role === 'user' && curr.status === 'active') acc.users++;
                return acc;
            }, { agents: 0, users: 0 });
            setDownlineCount(stats);
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

    const openCreateModal = (type: 'agent' | 'user') => {
        setCreateType(type);
        setIsCreateModalOpen(true);
    };

    return (
        <div className="space-y-10 py-6 pb-24 max-w-7xl mx-auto px-4 md:px-0">
            {/* Page Title & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-casino-gold-400" />
                        Master Agent
                    </h1>
                    <p className="text-casino-slate-500 mt-2 font-medium">Managing your network distribution and permissions</p>
                </div>
                <div className="flex w-full md:w-auto gap-3">
                    <button
                        onClick={() => openCreateModal('agent')}
                        className="flex-1 md:flex-none py-3 px-6 glass-panel rounded-xl flex items-center justify-center gap-2 text-white font-bold hover:bg-white/5 transition-all text-sm border-purple-500/20"
                    >
                        <UserPlus className="w-4 h-4 text-purple-400" />
                        New Agent
                    </button>
                    <button
                        onClick={() => openCreateModal('user')}
                        className="flex-1 md:flex-none py-3 px-6 btn-casino-primary rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                    >
                        <UserPlus className="w-4 h-4" />
                        New Player
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-casino-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Downline Agents</h3>
                        <p className="text-3xl font-display font-black text-white">{downlineCount.agents}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-casino-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Players</h3>
                        <p className="text-3xl font-display font-black text-white">{downlineCount.users}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-casino-gold-400/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-casino-gold-400/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-casino-gold-400" />
                        </div>
                        <div className="bg-casino-gold-400/10 px-2 py-0.5 rounded text-[9px] text-casino-gold-400 font-bold uppercase tracking-wider">Earnings</div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-casino-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Commission Balance</h3>
                        <p className="text-3xl font-display font-black text-white">₱ {profile?.credits?.toLocaleString() || '0.00'}</p>
                    </div>
                </div>
            </div>

            {/* Account Approvals Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                        <UserPlus size={20} className="text-casino-gold-400" />
                        Pending Approvals
                    </h2>
                    {pendingApprovals.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">
                            {pendingApprovals.length} Urgent
                        </span>
                    )}
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-casino-slate-500 text-[10px] uppercase font-black tracking-[0.15em]">
                                <tr>
                                    <th className="p-6">Identity</th>
                                    <th className="p-6">Contact Info</th>
                                    <th className="p-6">Social Link</th>
                                    <th className="p-6">Registered</th>
                                    <th className="p-6 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pendingApprovals.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-casino-slate-600 font-medium italic">All registrations are cleared.</td>
                                    </tr>
                                ) : (
                                    pendingApprovals.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6">
                                                <div className="font-bold text-white group-hover:text-casino-gold-400 transition-colors">{user.username}</div>
                                                <div className="text-[10px] text-casino-slate-500 uppercase font-black tracking-widest mt-1">{user.role.replace('_', ' ')}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-casino-slate-300 text-sm font-bold flex items-center gap-2">
                                                    <span className="opacity-40"><Phone size={14} /></span>
                                                    {user.phone_number || 'N/A'}
                                                </div>
                                            </td>
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
                                                    <span className="text-casino-slate-600 text-xs italic">Not Provided</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-xs text-casino-slate-500 font-medium">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleApproval(user.id, 'active')}
                                                        disabled={!!actionLoading}
                                                        className="bg-casino-gold-400 text-casino-dark-950 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-casino-gold-400/20"
                                                    >
                                                        {actionLoading === user.id ? '...' : 'Verify'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproval(user.id, 'banned')}
                                                        disabled={!!actionLoading}
                                                        className="bg-white/5 text-casino-slate-400 hover:text-red-400 hover:bg-red-400/10 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95"
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

            {/* Transaction Requests Section */}
            <div className="space-y-6">
                <h2 className="text-white font-display font-black text-xl uppercase tracking-wider flex items-center gap-3">
                    <Clock size={20} className="text-casino-gold-400" />
                    Pending Requests
                </h2>

                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-casino-slate-500 text-[10px] uppercase font-black tracking-[0.15em]">
                                <tr>
                                    <th className="p-6">User</th>
                                    <th className="p-6">Activity</th>
                                    <th className="p-6">Value</th>
                                    <th className="p-6">Timestamp</th>
                                    <th className="p-6 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-casino-slate-600 font-medium italic">Queue is currently empty.</td>
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
                                                    <div className={clsx("w-1 h-1 rounded-full animate-pulse", req.type === 'cash_in' ? "bg-green-500" : "bg-red-500")}></div>
                                                    {req.type.replace('_', ' ')}
                                                </div>
                                            </td>
                                            <td className="p-6 font-display font-black text-casino-gold-400 text-lg leading-none">₱ {req.amount.toLocaleString()}</td>
                                            <td className="p-6 text-xs text-casino-slate-500 font-medium">{new Date(req.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' })}</td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleAction(req.id, 'approved')}
                                                        disabled={!!actionLoading}
                                                        className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95 border border-green-500/20"
                                                    >
                                                        {actionLoading === req.id ? '...' : 'Complete'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'rejected')}
                                                        disabled={!!actionLoading}
                                                        className="bg-white/5 text-casino-slate-400 hover:text-red-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95"
                                                    >
                                                        Reject
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

            {/* Referral Link & Recruitment */}
            <div className="glass-panel p-8 md:p-10 rounded-3xl border-casino-gold-400/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-10">
                    <div className="max-w-md">
                        <h3 className="text-white font-display font-black text-2xl uppercase tracking-wider mb-2">Recruitment Hub</h3>
                        <p className="text-casino-slate-500 text-sm font-medium">Use your unique referral link to build and expand your agent and player network automatically.</p>
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
                            {copied ? <Check className="w-4 h-4 shadow-sm" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Link Copied' : 'Get Invite Link'}
                        </button>
                    </div>
                </div>
                {/* Background Decor */}
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
                    allowedRoles={createType === 'agent' ? ['agent'] : ['user']}
                    title={createType === 'agent' ? 'Recruit New Agent' : 'Register New Player'}
                />
            )}
        </div>
    );
};
