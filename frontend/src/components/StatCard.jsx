function StatCard({ label, value, trend }) {
  return (
    <div className="glass glass-hover p-8 rounded-[32px] transition-all duration-500">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
        {label}
      </p>
      <div className="mt-8 flex items-end justify-between">
        <p className="text-4xl font-medium tracking-tight text-white">{value}</p>
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${trend.includes('+') ? 'text-emerald-500/60' : 'text-white/20'}`}>
          {trend}
        </span>
      </div>
    </div>
  )
}

export default StatCard
