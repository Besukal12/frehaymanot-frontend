"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./AdminShell";

export type ManagementRow = {
  name: string;
  detail: string;
  category: string;
  status: "Published" | "Draft" | "Pending" | "Archived";
  date: string;
  metric: string;
};

type ManagementPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  searchPlaceholder: string;
  metricLabel: string;
  rows: ManagementRow[];
  actionKind?: "create" | "export";
};

export default function ManagementPage({
  eyebrow,
  title,
  description,
  actionLabel,
  searchPlaceholder,
  metricLabel,
  rows,
  actionKind = "create",
}: ManagementPageProps) {
  const [items, setItems] = useState(rows);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All status");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [newName, setNewName] = useState("");
  const filteredRows = items.filter((row) => {
    const matchesSearch = `${row.name} ${row.detail} ${row.category}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch && (status === "All status" || row.status === status);
  });

  function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newName.trim()) return;
    setItems([
      {
        name: newName.trim(),
        detail: "Created just now",
        category: "New",
        status: "Draft",
        date: "Just now",
        metric: "—",
      },
      ...items,
    ]);
    setNewName("");
    setModalOpen(false);
    setToast("Draft added to this preview");
    window.setTimeout(() => setToast(""), 2600);
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="heading-actions">
          {actionKind === "create" && (
            <button
              className="button button-quiet"
              onClick={() => {
                setToast("Export is a UI preview");
                window.setTimeout(() => setToast(""), 2200);
              }}
            >
              Export
            </button>
          )}
          <button
            className="button button-primary"
            onClick={() =>
              actionKind === "export"
                ? (setToast("Export is a UI preview"),
                  window.setTimeout(() => setToast(""), 2200))
                : setModalOpen(true)
            }
          >
            {actionKind === "create" && <span aria-hidden="true">+</span>}
            {actionLabel}
          </button>
        </div>
      </div>
      <section className="panel" aria-label={`${title} list`}>
        <div className="management-toolbar">
          <div className="toolbar-tools">
            <label className="search-box">
              <Icon name="search" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
              />
            </label>
            <select
              className="select-control"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status"
            >
              <option>All status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Pending</option>
              <option>Archived</option>
            </select>
          </div>
          <span className="crumb-current">{filteredRows.length} items</span>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th>{metricLabel}</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={`${row.name}-${index}`}>
                  <td>
                    <span className="table-primary">{row.name}</span>
                    <span className="table-secondary">{row.detail}</span>
                  </td>
                  <td>{row.category}</td>
                  <td>
                    <span className={`status-pill ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.date}</td>
                  <td>{row.metric}</td>
                  <td>
                    <button
                      className="row-action"
                      aria-label={`More actions for ${row.name}`}
                      onClick={() => {
                        setToast(`Actions for ${row.name} are a UI preview`);
                        window.setTimeout(() => setToast(""), 2200);
                      }}
                    >
                      ···
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-results">
                      No items match your search.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>
            Showing {filteredRows.length ? 1 : 0}–{filteredRows.length} of{" "}
            {filteredRows.length} items
          </span>
          <div className="pagination">
            <span className="page-number current">1</span>
            <span className="page-number">2</span>
            <span className="page-number">3</span>
            <button className="row-action" aria-label="Next page">
              ›
            </button>
          </div>
        </div>
      </section>
      {modalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <form className="modal" onSubmit={createItem}>
            <div className="modal-head">
              <div>
                <h2>{actionLabel}</h2>
                <p>This adds a local draft to the UI preview only.</p>
              </div>
              <button
                type="button"
                className="row-action"
                aria-label="Close dialog"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="field">
              <label htmlFor="new-item-name">Name</label>
              <input
                id="new-item-name"
                autoFocus
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder={`Enter a ${title.toLowerCase().replace(/s$/, "")} name`}
                required
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                Create draft
              </button>
            </div>
          </form>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
