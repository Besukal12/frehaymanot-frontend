import ManagementPage, {
  type ManagementRow,
} from "../../../../components/ManagementPage";

const rows: ManagementRow[] = [
  {
    name: "St. Yared Collection",
    detail: "Traditional Ethiopian Orthodox hymns",
    category: "Mezmurs",
    status: "Published",
    date: "Oct 01, 2026",
    metric: "24 items",
  },
  {
    name: "Marian Hymns",
    detail: "Songs in praise of Saint Mary",
    category: "Mezmurs",
    status: "Published",
    date: "Sep 28, 2026",
    metric: "18 items",
  },
  {
    name: "Sunday Service",
    detail: "Hymns for the weekly liturgy",
    category: "Mezmurs",
    status: "Published",
    date: "Sep 22, 2026",
    metric: "32 items",
  },
  {
    name: "Morning Prayer",
    detail: "Quiet songs for daily devotion",
    category: "Mezmurs",
    status: "Draft",
    date: "Sep 18, 2026",
    metric: "11 items",
  },
  {
    name: "Feast Days",
    detail: "Seasonal and feast day selections",
    category: "Mezmurs",
    status: "Published",
    date: "Sep 12, 2026",
    metric: "16 items",
  },
];

export default function MezmurCategory() {
  return (
    <ManagementPage
      eyebrow="Library"
      title="Categories"
      description="Organize hymns into collections that make discovery feel natural."
      actionLabel="Add category"
      searchPlaceholder="Search categories..."
      metricLabel="Mezmurs"
      rows={rows}
    />
  );
}
