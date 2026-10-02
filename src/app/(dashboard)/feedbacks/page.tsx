import ManagementPage, {
  type ManagementRow,
} from "../../../components/ManagementPage";

const rows: ManagementRow[] = [
  {
    name: "A peaceful place to learn",
    detail: "“I feel closer to my faith every day.” · Selam T.",
    category: "App experience",
    status: "Pending",
    date: "Oct 03, 2026",
    metric: "5 / 5",
  },
  {
    name: "More songs for feast days",
    detail: "“Could you add the Meskel collection?” · Dawit M.",
    category: "Content request",
    status: "Pending",
    date: "Oct 02, 2026",
    metric: "4 / 5",
  },
  {
    name: "Course audio is wonderful",
    detail: "“The narration makes each lesson clear.” · Hana K.",
    category: "Course feedback",
    status: "Published",
    date: "Oct 01, 2026",
    metric: "5 / 5",
  },
  {
    name: "Download for offline listening",
    detail: "“I would love to listen while travelling.” · Yonas A.",
    category: "Feature request",
    status: "Archived",
    date: "Sep 28, 2026",
    metric: "4 / 5",
  },
  {
    name: "Thank you for this resource",
    detail: "“My family listens together every evening.” · Meron G.",
    category: "Community",
    status: "Published",
    date: "Sep 25, 2026",
    metric: "5 / 5",
  },
];

export default function Feedbacks() {
  return (
    <ManagementPage
      eyebrow="Community"
      title="Feedback"
      description="Listen closely to the people learning, listening, and growing with you."
      actionLabel="Export feedback"
      actionKind="export"
      searchPlaceholder="Search feedback..."
      metricLabel="Rating"
      rows={rows}
    />
  );
}
