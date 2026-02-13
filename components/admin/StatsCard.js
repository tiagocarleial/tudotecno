export default function StatsCard({ label, value, color = '#2859f1', icon }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4 shadow-sm">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[var(--text-weak)] text-sm">{label}</p>
        <p className="text-2xl font-extrabold text-[var(--text-strong)] leading-none mt-0.5">{value}</p>
      </div>
    </div>
  );
}
