import ManagementPage, {
  type ManagementRow,
} from "../../../components/ManagementPage";

const rows: ManagementRow[] = [
  {
    name: "ወላዲተ አምላክ",
    detail: "St. Yared collection · 06:42",
    category: "Marian",
    status: "Published",
    date: "Oct 02, 2026",
    metric: "12,842 plays",
  },
  {
    name: "መድኃኔ ዓለም",
    detail: "Sunday collection · 08:15",
    category: "Sunday",
    status: "Published",
    date: "Sep 29, 2026",
    metric: "9,610 plays",
  },
  {
    name: "ሰላም ለኪ",
    detail: "Morning prayer · 04:18",
    category: "Prayer",
    status: "Draft",
    date: "Sep 28, 2026",
    metric: "—",
  },
  {
    name: "አንተ ብርሃኔ",
    detail: "St. Yared collection · 07:03",
    category: "Praise",
    status: "Published",
    date: "Sep 26, 2026",
    metric: "6,904 plays",
  },
  {
    name: "ምስጋና ይድረስ",
    detail: "Evening prayer · 05:31",
    category: "Prayer",
    status: "Pending",
    date: "Sep 24, 2026",
    metric: "—",
  },
  {
    name: "ክብር ለአብ",
    detail: "Sunday collection · 03:57",
    category: "Sunday",
    status: "Published",
    date: "Sep 21, 2026",
    metric: "4,208 plays",
  },
];

export default function Mezmurs() {
  return (
    <ManagementPage
      eyebrow="Library"
      title="Mezmurs"
      description="Manage the hymns and spiritual music shared with your community."
      actionLabel="Add mezmur"
      searchPlaceholder="Search mezmurs..."
      metricLabel="Plays"
      rows={rows}
    />
  );
}
