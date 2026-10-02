"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "../../../components/AdminShell";

const traffic = [
  {
    label: "Mezmur listeners",
    value: "8,426",
    share: "48%",
    width: "78%",
    color: "",
  },
  {
    label: "Course learners",
    value: "4,218",
    share: "27%",
    width: "57%",
    color: "gold",
  },
  {
    label: "Returning visitors",
    value: "2,931",
    share: "17%",
    width: "42%",
    color: "blue",
  },
  {
    label: "New visitors",
    value: "1,206",
    share: "8%",
    width: "26%",
    color: "green",
  },
];

const popularItems = [
  {
    title: "ወላዲተ አምላክ",
    subtitle: "Mezmur · St. Yared collection",
    views: "12.8k",
  },
  {
    title: "Foundations of Faith",
    subtitle: "Course · 8 lessons",
    views: "8.4k",
  },
  { title: "መድኃኔ ዓለም", subtitle: "Mezmur · Sunday collection", views: "6.2k" },
  {
    title: "The Book of Psalms",
    subtitle: "Course · 12 lessons",
    views: "4.7k",
  },
];

export default function Overview() {
  const [period, setPeriod] = useState("7 days");
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Saturday, October 3, 2026</div>
          <h1>Good morning, Abebe</h1>
          <p>Here is what is happening across your community today.</p>
        </div>
        <div className="heading-actions">
          <button
            className="button"
            onClick={() =>
              setPeriod(period === "7 days" ? "30 days" : "7 days")
            }
          >
            <span aria-hidden="true">▦</span> Last {period}
          </button>
          <button
            className="button button-primary"
            onClick={() => window.location.assign("/announcements")}
          >
            <span aria-hidden="true">+</span>New announcement
          </button>
        </div>
      </div>

      <section className="stat-grid" aria-label="Key performance indicators">
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Total listeners</span>
            <span className="stat-icon">
              <Icon name="music" />
            </span>
          </div>
          <div className="stat-value">17,842</div>
          <div className="stat-foot">
            <span className="trend">↗ 12.8%</span>
            <span>vs. previous 7 days</span>
          </div>
        </article>
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Course enrollments</span>
            <span className="stat-icon gold">
              <Icon name="book" />
            </span>
          </div>
          <div className="stat-value">6,304</div>
          <div className="stat-foot">
            <span className="trend">↗ 8.3%</span>
            <span>vs. previous 7 days</span>
          </div>
        </article>
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Active this month</span>
            <span className="stat-icon green">
              <Icon name="grid" />
            </span>
          </div>
          <div className="stat-value">9,216</div>
          <div className="stat-foot">
            <span className="trend">↗ 4.6%</span>
            <span>vs. previous month</span>
          </div>
        </article>
        <article className="panel stat-card">
          <div className="stat-top">
            <span className="stat-label">Avg. engagement</span>
            <span className="stat-icon blue">
              <Icon name="spark" />
            </span>
          </div>
          <div className="stat-value">6m 42s</div>
          <div className="stat-foot">
            <span className="trend down">↘ 1.2%</span>
            <span>vs. previous 7 days</span>
          </div>
        </article>
      </section>

      <section className="dashboard-grid" aria-label="Analytics">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title">Community growth</h2>
              <p className="panel-subtitle">Listeners and learners over time</p>
            </div>
            <div
              className="chart-tabs"
              role="group"
              aria-label="Analytics period"
            >
              {["7 days", "30 days", "90 days"].map((item) => (
                <button
                  key={item}
                  className={`chart-tab${period === item ? " active" : ""}`}
                  onClick={() => setPeriod(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-wrap">
            <div className="chart-legend">
              <span className="legend-item">
                <i className="legend-dot" />
                Listeners
              </span>
              <span className="legend-item">
                <i className="legend-dot gold" />
                Learners
              </span>
              <span className="crumb">{period} · +12.8% growth</span>
            </div>
            <svg
              className="line-chart"
              viewBox="0 0 680 220"
              role="img"
              aria-label="Line graph showing steady listener and learner growth"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity=".17"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              {[25, 68, 111, 154, 197].map((y) => (
                <g key={y}>
                  <line
                    className="chart-gridline"
                    x1="42"
                    x2="665"
                    y1={y}
                    y2={y}
                  />
                  <text className="chart-axis" x="4" y={y + 3}>
                    {Math.round((220 - y) * 95).toLocaleString()}
                  </text>
                </g>
              ))}
              <path
                className="chart-area"
                d="M48 166 C82 159 97 143 132 149 S183 128 218 134 S272 104 308 116 S360 94 398 101 S448 75 485 84 S540 58 575 67 S626 44 660 43 L660 197 L48 197Z"
              />
              <path
                className="chart-line-main"
                d="M48 166 C82 159 97 143 132 149 S183 128 218 134 S272 104 308 116 S360 94 398 101 S448 75 485 84 S540 58 575 67 S626 44 660 43"
              />
              <path
                className="chart-line-alt"
                d="M48 183 C85 177 99 168 132 171 S185 151 218 159 S275 142 308 146 S363 128 398 136 S449 113 485 121 S540 100 575 106 S627 86 660 91"
              />
              {[
                "Sep 27",
                "Sep 28",
                "Sep 29",
                "Sep 30",
                "Oct 1",
                "Oct 2",
                "Oct 3",
              ].map((label, index) => (
                <text
                  key={label}
                  className="chart-axis"
                  x={48 + index * 102}
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
              <h2 className="panel-title">Audience overview</h2>
              <p className="panel-subtitle">Where engagement comes from</p>
            </div>
            <button
              className="row-action"
              aria-label="Audience overview details"
            >
              ···
            </button>
          </div>
          <div className="traffic-content">
            <div className="traffic-total">
              <strong>17,842</strong>
              <span>unique visitors</span>
            </div>
            {traffic.map((item) => (
              <div className="traffic-row" key={item.label}>
                <div className="traffic-label">
                  <span>{item.label}</span>
                  <span>
                    {item.value} · {item.share}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${item.color}`}
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-bottom">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title">Recent activity</h2>
              <p className="panel-subtitle">
                The latest from your content and community
              </p>
            </div>
            <Link className="text-link" href="/feedbacks">
              View all <Icon name="arrow" />
            </Link>
          </div>
          <div className="activity-list">
            <div className="activity-row">
              <span className="activity-icon">
                <Icon name="music" />
              </span>
              <span className="activity-copy">
                <strong>New mezmur published: ወላዲተ አምላክ</strong>
                <span>Published by Abebe Bekele</span>
              </span>
              <span className="activity-time">18 min ago</span>
            </div>
            <div className="activity-row">
              <span className="activity-icon">
                <Icon name="book" />
              </span>
              <span className="activity-copy">
                <strong>Course enrollment milestone reached</strong>
                <span>Foundations of Faith · 1,000 learners</span>
              </span>
              <span className="activity-time">2 hours ago</span>
            </div>
            <div className="activity-row">
              <span className="activity-icon">
                <Icon name="message" />
              </span>
              <span className="activity-copy">
                <strong>New community feedback received</strong>
                <span>“A beautiful way to stay connected...”</span>
              </span>
              <span className="activity-time">4 hours ago</span>
            </div>
            <div className="activity-row">
              <span className="activity-icon">
                <Icon name="megaphone" />
              </span>
              <span className="activity-copy">
                <strong>Announcement sent to all listeners</strong>
                <span>Sunday service schedule</span>
              </span>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
        </article>
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title">Most loved content</h2>
              <p className="panel-subtitle">Top by views this week</p>
            </div>
            <Link className="text-link" href="/mezmurs">
              Explore <Icon name="arrow" />
            </Link>
          </div>
          <div className="popular-list">
            {popularItems.map((item, index) => (
              <div className="popular-row" key={item.title}>
                <span className="rank">0{index + 1}</span>
                <span className="popular-copy">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </span>
                <span className="popular-views">{item.views}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
