import { Wallet, Users } from 'lucide-react';
import clsx from 'clsx';

interface RoleAnalyticsCardProps {
    roleName: string;
    count: number;
    totalCredits: number;
    colorClass?: string;
    onClick?: () => void;
}

export const RoleAnalyticsCard = ({ roleName, count, totalCredits, colorClass = "bg-blue-500", onClick }: RoleAnalyticsCardProps) => {
    return (
        <div
            onClick={onClick}
            className={clsx(
                "glass-panel rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all",
                onClick && "cursor-pointer hover:bg-white/5 active:scale-[0.98]"
            )}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className={clsx("w-1 h-10 rounded-full", colorClass)}></div>
                <div>
                    <h3 className="text-white font-display font-black text-lg leading-none">{roleName}</h3>
                    <p className="text-[10px] text-casino-slate-500 uppercase font-black tracking-[0.2em] mt-1">Analytics</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-casino-slate-500">
                        <Users size={12} />
                        <span className="text-[9px] uppercase font-black tracking-wider">Active</span>
                    </div>
                    <span className="text-xl font-display font-bold text-white leading-none">{count}</span>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1 text-casino-slate-500">
                        <Wallet size={12} />
                        <span className="text-[9px] uppercase font-black tracking-wider">Credits</span>
                    </div>
                    <span className="text-xl font-display font-bold text-white truncate leading-none block" title={totalCredits.toLocaleString()}>
                        ₱{totalCredits.toLocaleString(undefined, { notation: "compact", maximumFractionDigits: 1 })}
                    </span>
                </div>
            </div>
        </div>
    );
};
