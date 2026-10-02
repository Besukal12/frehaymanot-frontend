function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`skeleton-block ${className}`} aria-hidden="true" />;
}

export function DashboardSkeleton() {
  return (
    <div
      className="skeleton-page"
      aria-label="Loading dashboard"
      aria-busy="true"
    >
      <div className="skeleton-heading">
        <div>
          <SkeletonBlock className="skeleton-eyebrow" />
          <SkeletonBlock className="skeleton-title" />
          <SkeletonBlock className="skeleton-description" />
        </div>
        <SkeletonBlock className="skeleton-button" />
      </div>
      <div className="stat-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="panel stat-card" key={index}>
            <SkeletonBlock className="skeleton-line short" />
            <SkeletonBlock className="skeleton-number" />
            <SkeletonBlock className="skeleton-line medium" />
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="panel skeleton-chart">
          <div className="panel-heading">
            <SkeletonBlock className="skeleton-line medium" />
            <SkeletonBlock className="skeleton-button" />
          </div>
          <div className="skeleton-chart-area">
            <SkeletonBlock className="skeleton-chart-shape" />
          </div>
        </div>
        <div className="panel skeleton-traffic">
          <div className="panel-heading">
            <SkeletonBlock className="skeleton-line medium" />
          </div>
          {Array.from({ length: 4 }, (_, index) => (
            <div className="skeleton-traffic-row" key={index}>
              <SkeletonBlock className="skeleton-line medium" />
              <SkeletonBlock className="skeleton-line full" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only">Loading content…</p>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div
      className="panel skeleton-table"
      aria-label="Loading records"
      aria-busy="true"
    >
      <div className="management-toolbar">
        <SkeletonBlock className="skeleton-search" />
        <SkeletonBlock className="skeleton-button" />
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-table-row" key={index}>
          <SkeletonBlock className="skeleton-line long" />
          <SkeletonBlock className="skeleton-line short" />
          <SkeletonBlock className="skeleton-pill" />
          <SkeletonBlock className="skeleton-line medium" />
        </div>
      ))}
      <p className="sr-only">Loading records…</p>
    </div>
  );
}

export function SkeletonBlockElement({
  className = "",
}: {
  className?: string;
}) {
  return <SkeletonBlock className={className} />;
}
