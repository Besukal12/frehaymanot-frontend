"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardSkeleton } from "./LoadingSkeleton";
import { Icon } from "./AdminShell";
import {
  fetchDashboardContent,
  type Announcement,
  type ContentRecord,
} from "../lib/api";

type DashboardData = {
  mezmurs: ContentRecord[];
  courses: ContentRecord[];
  announcements: Announcement[];
};

type Activity = {
  title: string;
  kind: string;
  createdAt: string;
  icon: string;
};

const periods = [7, 30, 90] as const;

function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function getBuckets(records: Activity[], dayCount: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - dayCount + 1);
  const buckets = Array.from({ length: dayCount }, () => ({
    mezmurs: 0,
    courses: 0,
    announcements: 0,
  }));

  for (const record of records) {
    const date = new Date(record.createdAt);
    const index = Math.floor((date.getTime() - start.getTime()) / 86400000);
    if (index < 0 || index >= dayCount) continue;
    if (record.kind === "Mezmur") buckets[index].mezmurs += 1;
    if (record.kind === "Course") buckets[index].courses += 1;
    if (record.kind === "Announcement") buckets[index].announcements += 1;
  }

  return buckets;
}

function linePoints(values: number[], maxValue: number) {
  const left = 48;
  const right = 660;
  const top = 32;
  const bottom = 193;
  return values
    .map((value, index) => {
      const x =
        left +
        (values.length < 2
          ? 0
          : (index / (values.length - 1)) * (right - left));
      const y = bottom - (value / maxValue) * (bottom - top);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function getActivity(data: DashboardData): Activity[] {
  return [
    ...data.mezmurs.map((item) => ({
      title: item.title,
      kind: "Mezmur",
      createdAt: item.createdAt,
      icon: "music",
    })),
    ...data.courses.map((item) => ({
      title: item.title,
      kind: "Course",
      createdAt: item.createdAt,
      icon: "book",
    })),
    ...data.announcements.map((item) => ({
      title: item.title,
      kind: "Announcement",
      createdAt: item.createdAt,
      icon: "megaphone",
    })),
  ].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export default function LiveOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<(typeof periods)[number]>(7);

  async function load() {
    try {
      setData(await fetchDashboardContent());
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return (
      <section className="panel dashboard-error" role="alert">
        <div className="eyebrow">Dashboard data unavailable</div>
        <h1>We couldn’t load your latest content.</h1>
        <p>{error || "Try again to reconnect to the content API."}</p>
        <button
          className="button button-primary"
          onClick={() => {
            setLoading(true);
            void load();
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  const activity = getActivity(data);
  const buckets = getBuckets(activity, period);
  const maxValue = Math.max(
    1,
    ...buckets.flatMap((bucket) => [
      bucket.mezmurs,
      bucket.courses,
      bucket.announcements,
    ]),
  );
  const totalItems =
    data.mezmurs.length + data.courses.length + data.announcements.length;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const addedThisMonth = activity.filter(
    (item) => new Date(item.createdAt) >= monthStart,
  ).length;
  const mix = [
    { label: "Mezmurs", amount: data.mezmurs.length, color: "" },
    { label: "Courses", amount: data.courses.length, color: "gold" },
    {
      label: "Announcements",
      amount: data.announcements.length,
      color: "blue",
    },
  ];
  const labels = Array.from({ length: 7 }, (_, index) => {
    const bucketIndex = Math.round((index / 6) * (period - 1));
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (period - bucketIndex - 1));
    return {
      label: formatDate(date, { month: "short", day: "numeric" }),
      index: bucketIndex,
    };
  });
  const recentActivity = activity.slice(0, 5);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {formatDate(new Date(), {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h1>Content overview</h1>
          <p>A live view of what has been published across your community.</p>
        </div>
        <div className="heading-actions">
          <Link className="button button-primary" href="/announcements">
            <span aria-hidden="true">＋</span>New announcement
          </Link>
        </div>
      </div>
      <section className="stat-grid" aria-label="Content inventory">
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Published mezmurs</span>
            <span className="stat-icon">
              <Icon name="music" />
            </span>
          </div>
          <div className="stat-value">
            {data.mezmurs.length.toLocaleString()}
          </div>
          <div className="stat-foot">Available in the public catalog</div>
        </article>
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Published courses</span>
            <span className="stat-icon gold">
              <Icon name="book" />
            </span>
          </div>
          <div className="stat-value">
            {data.courses.length.toLocaleString()}
          </div>
          <div className="stat-foot">Available in the learning library</div>
        </article>
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Announcements</span>
            <span className="stat-icon blue">
              <Icon name="megaphone" />
            </span>
          </div>
          <div className="stat-value">
            {data.announcements.length.toLocaleString()}
          </div>
          <div className="stat-foot">Published messages in the API</div>
        </article>
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Added this month</span>
            <span className="stat-icon green">
              <Icon name="spark" />
            </span>
          </div>
          <div className="stat-value">{addedThisMonth.toLocaleString()}</div>
          <div className="stat-foot">New content records · all types</div>
        </article>
      </section>
      <section className="dashboard-grid" aria-label="Publishing analytics">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title">Publishing activity</h2>
              <p className="panel-subtitle">
                Actual new records by creation date
              </p>
            </div>
            <div
              className="chart-tabs"
              role="group"
              aria-label="Chart date range"
            >
              {periods.map((days) => (
                <button
                  key={days}
                  className={`chart-tab${period === days ? " active" : ""}`}
                  onClick={() => setPeriod(days)}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>
          <div className="chart-wrap">
            <div className="chart-legend">
              <span className="legend-item">
                <i className="legend-dot" />
                Mezmurs
              </span>
              <span className="legend-item">
                <i className="legend-dot gold" />
                Courses
              </span>
              <span className="legend-item">
                <i className="legend-dot blue" />
                Announcements
              </span>
            </div>
            <svg
              className="line-chart"
              viewBox="0 0 680 220"
              role="img"
              aria-label={`Daily new content during the last ${period} days`}
            >
              {[32, 72, 112, 152, 193].map((y, index) => (
                <g key={y}>
                  <line
                    className="chart-gridline"
                    x1="42"
                    x2="665"
                    y1={y}
                    y2={y}
                  />
                  <text className="chart-axis" x="10" y={y + 3}>
                    {Math.ceil((maxValue * (4 - index)) / 4)}
                  </text>
                </g>
              ))}
              <polyline
                className="chart-line-main"
                points={linePoints(
                  buckets.map((bucket) => bucket.mezmurs),
                  maxValue,
                )}
              />
              <polyline
                className="chart-line-alt"
                points={linePoints(
                  buckets.map((bucket) => bucket.courses),
                  maxValue,
                )}
              />
              <polyline
                className="chart-line-tertiary"
                points={linePoints(
                  buckets.map((bucket) => bucket.announcements),
                  maxValue,
                )}
              />
              {labels.map(({ label, index }) => (
                <text
                  key={`${label}-${index}`}
                  className="chart-axis"
                  x={48 + (index / Math.max(1, period - 1)) * 612}
                  y="216"
                  textAnchor="middle"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>
        </article>
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title">Content mix</h2>
              <p className="panel-subtitle">
                Share of current published records
              </p>
            </div>
          </div>
          <div className="traffic-content">
            <div className="traffic-total">
              <strong>{totalItems.toLocaleString()}</strong>
              <span>total records</span>
            </div>
            {mix.map((item) => {
              const percentage = totalItems
                ? Math.round((item.amount / totalItems) * 100)
                : 0;
              return (
                <div className="traffic-row" key={item.label}>
                  <div className="traffic-label">
                    <span>
                      {item.label} · {item.amount}
                    </span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="panel-subtitle analytics-caveat">
              The API does not currently record listens, views, or course
              enrollments.
            </p>
          </div>
        </article>
      </section>
      <section className="dashboard-bottom dashboard-bottom-single">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title">Recently added</h2>
              <p className="panel-subtitle">
                Latest records from the live catalog
              </p>
            </div>
            <Link className="text-link" href="/mezmurs">
              Browse library <Icon name="arrow" />
            </Link>
          </div>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div
                className="activity-row"
                key={`${item.kind}-${item.title}-${item.createdAt}`}
              >
                <span className="activity-icon">
                  <Icon name={item.icon} />
                </span>
                <span className="activity-copy">
                  <strong>{item.title}</strong>
                  <span>
                    {item.kind} ·{" "}
                    {formatDate(new Date(item.createdAt), {
                      dateStyle: "medium",
                    })}
                  </span>
                </span>
                <span className="activity-time">
                  {formatDate(new Date(item.createdAt), {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="empty-results">
                No content has been added yet.
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
