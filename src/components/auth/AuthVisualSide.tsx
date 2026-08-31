import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, TrendingUp, Zap, FileText, Star, Award } from 'lucide-react';

export const AuthVisualSide: React.FC<{ quote?: string }> = ({ quote }) => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden border-l border-slate-800">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">ResumeForge</span>
            <span className="text-xs font-semibold px-2 py-0.5 ml-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              AI ATS 2.0
            </span>
          </div>
        </div>
      </div>

      {/* Center Interactive Visual Showcase */}
      <div className="relative z-10 my-auto space-y-6 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-blue-300 text-xs font-medium backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time ATS Scoring Engine & Grounded AI</span>
        </div>

        <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
          {quote || 'Your experience deserves a better resume. Create yours with AI.'}
        </h2>

        {/* Live Transformation Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-400 ml-2">Live AI Bullet Enhancement</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ATS 98/100</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Original Draft
              </span>
              <p className="text-slate-400 line-through">"Worked on the company website and fixed bugs for clients."</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  AI Enhanced Impact Bullet
                </span>
                <span className="text-[10px] font-semibold text-emerald-400">+38% Match Rate</span>
              </div>
              <p className="text-slate-100 font-medium leading-relaxed">
                "Architected high-throughput responsive web components reducing page latency by 42% and increasing user checkout conversion across 120k monthly active users."
              </p>
            </div>
          </div>
        </div>

        {/* Feature Pill Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">8 ATS Clean Templates</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">Job Description Tailoring</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">1-Click PDF Export</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">Zero Hallucinated Data</span>
          </div>
        </div>
      </div>

      {/* Bottom User Endorsement */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-200">Trusted by 60,000+ job seekers</p>
            <p className="text-[11px] text-slate-400">Average ATS score increase from 62 to 94</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
};
