const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-3">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-4 w-64" />
        <div className="skeleton h-3 w-48" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-9 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonCard;
