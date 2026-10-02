import ManagementPage, {
  type ManagementRow,
} from "../../../components/ManagementPage";

const rows: ManagementRow[] = [
  {
    name: "Sunday service schedule",
    detail: "Join us this Sunday for the Divine Liturgy...",
    category: "All listeners",
    status: "Published",
    date: "Oct 02, 2026",
    metric: "82% read",
  },
  {
    name: "New courses are here",
    detail: "Explore our latest learning paths...",
    category: "Learners",
    status: "Published",
    date: "Sep 26, 2026",
    metric: "74% read",
  },
  {
    name: "Meskel celebration collection",
    detail: "A special collection for the season...",
    category: "All listeners",
    status: "Draft",
    date: "Sep 20, 2026",
    metric: "—",
  },
  {
    name: "Community listening evening",
    detail: "An invitation to gather and listen together...",
    category: "All listeners",
    status: "Archived",
    date: "Sep 12, 2026",
    metric: "91% read",
  },
];

export default function Announcements() {
  return (
    <ManagementPage
      eyebrow="Community"
      title="Announcements"
      description="Share service updates, new releases, and moments worth celebrating."
      actionLabel="New announcement"
      searchPlaceholder="Search announcements..."
      metricLabel="Read rate"
      rows={rows}
    />
  );
}
