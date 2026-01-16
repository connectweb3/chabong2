import { Coins, Flame, Info, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export const UserDashboard = () => {

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-casino-dark-950 overflow-hidden rounded-3xl border border-white/5">
            {/* LEFT COLUMN: LIVE STREAM */}
            <div className="flex-1 flex flex-col relative bg-black group min-h-[300px] lg:min-h-0">
                {/* Stream Header Info */}
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-white font-bold text-[10px] uppercase tracking-wider">Live Stream</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-casino-slate-300 font-medium">
                        Fight #68
                    </div>
                </div>

                {/* Video Container with anti-piracy measures */}
                <div
                    className="relative flex-1 bg-black flex items-center justify-center overflow-hidden"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <div className='w-full h-full relative'>
                        <iframe
                            src="https://vdo.ninja/?view=eVNeDyY&autoplay=1&muted=1&clean=1&logo=0&ncl=1&noheader=1"
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            style={{ pointerEvents: 'auto' }}
                        />

                        {/* Protection Layer: Discourages inspection and direct interaction with the player controls */}
                        <div className="absolute inset-0 z-10 bg-transparent pointer-events-none select-none">
                            {/* Subtle watermark or branding overlay could go here */}
                        </div>
                    </div>
                    {/* Overlay for premium feel */}
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] z-20" />
                </div>
            </div>

            {/* RIGHT COLUMN: BETTING CONSOLE */}
            <div className="w-full lg:w-[420px] bg-casino-dark-900 flex flex-col border-l border-white/5">
                {/* Status Bar */}
                <div className="bg-casino-gold-400 py-3 px-6 flex items-center justify-between shadow-lg z-10">
                    <div className="flex items-center gap-2">
                        <Flame size={16} className="text-casino-dark-950" />
                        <span className="text-casino-dark-950 font-display font-black text-sm uppercase tracking-wider">Place Your Bets</span>
                    </div>
                    <div className="bg-casino-dark-950/20 px-2 py-0.5 rounded-lg">
                        <span className="text-casino-dark-950 font-bold font-display text-lg">68</span>
                    </div>
                </div>

                {/* MERON / WALA GRID */}
                <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3 h-64 lg:h-80">
                        {/* MERON SIDE */}
                        <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel border-red-500/20 hover:border-red-500/40 transition-all">
                            <div className="bg-red-600/10 py-2 text-center border-b border-red-500/20">
                                <span className="text-red-500 font-black tracking-widest text-xs">MERON</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-4">
                                <div className="text-2xl font-display font-black text-white mb-1">573,137</div>
                                <div className="text-[10px] text-casino-slate-500 font-bold uppercase mb-4">Payout <span className="text-red-400">183.24</span></div>
                                <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl uppercase text-xs shadow-[0_4px_15px_rgba(220,38,38,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Coins size={14} /> Bet
                                </button>
                            </div>
                            <div className="bg-black/20 p-2 text-center">
                                <span className="text-[9px] text-casino-slate-500 uppercase">My Bet: <span className="text-white">0</span></span>
                            </div>
                        </div>

                        {/* WALA SIDE */}
                        <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel border-blue-500/20 hover:border-blue-500/40 transition-all">
                            <div className="bg-blue-600/10 py-2 text-center border-b border-blue-500/20">
                                <span className="text-blue-500 font-black tracking-widest text-xs">WALA</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                                <div className="text-2xl font-display font-black text-white mb-1">586,492</div>
                                <div className="text-[10px] text-casino-slate-500 font-bold uppercase mb-4">Payout <span className="text-blue-400">177.25</span></div>
                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl uppercase text-xs shadow-[0_4px_15px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Coins size={14} /> Bet
                                </button>
                            </div>
                            <div className="bg-black/20 p-2 text-center">
                                <span className="text-[9px] text-casino-slate-500 uppercase">My Bet: <span className="text-white">0</span></span>
                            </div>
                        </div>
                    </div>

                    {/* QUICK BET INPUT */}
                    <div className="glass-panel rounded-2xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-casino-gold-400 uppercase tracking-widest">Amount</span>
                            <button className="text-[9px] font-bold text-casino-slate-500 hover:text-white uppercase transition-colors">Clear</button>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-lg font-display font-bold text-white">₱ 0</span>
                            <ChevronRight className="text-casino-gold-400 w-5 h-5" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[100, 500, 1000, 5000].map((val) => (
                                <button key={val} className="py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold text-casino-slate-300 transition-all">
                                    {val >= 1000 ? `${val / 1000}K` : val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DRAW SECTION */}
                    <div className="bg-green-600/5 border border-green-500/20 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Info size={14} className="text-green-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white uppercase">Draw Bet</span>
                                <span className="text-[9px] text-green-500 font-medium">Payout x8 Return</span>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded-lg uppercase transition-all shadow-lg active:scale-95">
                            Bet Draw
                        </button>
                    </div>

                    {/* PATTERNS / LOGS */}
                    <div className="mt-2">
                        <div className="text-[10px] font-bold text-casino-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ChevronRight size={12} className="text-casino-gold-400" /> Recent Results
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {[1, 0, 1, 1, 0, 2, 1, 0, 1].map((res, i) => (
                                <div key={i} className={clsx(
                                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border",
                                    res === 1 ? "bg-red-500/10 border-red-500/30 text-red-500" :
                                        res === 0 ? "bg-blue-500/10 border-blue-500/30 text-blue-500" :
                                            "bg-green-500/10 border-green-500/30 text-green-500"
                                )}>
                                    {res === 1 ? 'M' : res === 0 ? 'W' : 'D'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
