import ManagementPage, {
  type ManagementRow,
} from "../../../components/ManagementPage";

const rows: ManagementRow[] = [
  {
    name: "Foundations of Faith",
    detail: "8 lessons · 3h 20m · Beginner",
    category: "Faith & Practice",
    status: "Published",
    date: "Oct 02, 2026",
    metric: "1,284 enrolled",
  },
  {
    name: "The Book of Psalms",
    detail: "12 lessons · 5h 10m · All levels",
    category: "Scripture",
    status: "Published",
    date: "Sep 27, 2026",
    metric: "936 enrolled",
  },
  {
    name: "Living the Liturgy",
    detail: "6 lessons · 2h 45m · Intermediate",
    category: "Faith & Practice",
    status: "Draft",
    date: "Sep 25, 2026",
    metric: "—",
  },
  {
    name: "Introduction to Ge'ez",
    detail: "10 lessons · 4h 00m · Beginner",
    category: "Language",
    status: "Published",
    date: "Sep 19, 2026",
    metric: "812 enrolled",
  },
  {
    name: "Lives of the Saints",
    detail: "9 lessons · 3h 50m · All levels",
    category: "Church History",
    status: "Pending",
    date: "Sep 14, 2026",
    metric: "—",
  },
];

export default function Courses() {
  return (
    <ManagementPage
      eyebrow="Learning"
      title="Courses"
      description="Build thoughtful learning paths and follow how your learners progress."
      actionLabel="Create course"
      searchPlaceholder="Search courses..."
      metricLabel="Learners"
      rows={rows}
    />
  );
}
