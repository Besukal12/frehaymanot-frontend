"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useAdminAuth } from "../../../components/AdminAuthProvider";
import { TableSkeleton } from "../../../components/LoadingSkeleton";
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  updateAnnouncement,
  type Announcement,
  type AnnouncementInput,
} from "../../../lib/api";

const audiences: AnnouncementInput["audience"][] = [
  "EVERYONE",
  "YOUTH",
  "CENTRAL",
  "CHILDREN",
];

function audienceLabel(audience: Announcement["audience"]) {
  return audience === "EVERYONE"
    ? "Everyone"
    : audience[0] + audience.slice(1).toLowerCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export default function Announcements() {
  const { isConfigured, isSignedIn, getToken } = useAdminAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("All audiences");
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    },
    [thumbnailPreview],
  );

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = isSignedIn ? await getToken() : null;
      setAnnouncements(await fetchAnnouncements(token));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load announcements.",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAnnouncements(), 0);
    return () => window.clearTimeout(timer);
  }, [loadAnnouncements]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input: AnnouncementInput = {
      title: String(form.get("title") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim(),
      content: String(form.get("content") ?? "").trim(),
      audience: String(
        form.get("audience") ?? "EVERYONE",
      ) as AnnouncementInput["audience"],
    };
    setSaving(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Sign in before managing announcements.");
      if (editing) {
        const response = await updateAnnouncement(
          editing.id,
          input,
          token,
          thumbnailFile,
        );
        setAnnouncements((current) =>
          current.map((item) =>
            item.id === editing.id ? response.announcement : item,
          ),
        );
      } else {
        const response = await createAnnouncement(input, token, thumbnailFile);
        setAnnouncements((current) => [response.announcement, ...current]);
      }
      setModalOpen(false);
      setEditing(null);
      setThumbnailFile(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save announcement.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Announcement) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`))
      return;
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Sign in before managing announcements.");
      await deleteAnnouncement(item.id, token);
      setAnnouncements((current) =>
        current.filter((entry) => entry.id !== item.id),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to delete announcement.",
      );
    }
  }

  const visibleAnnouncements = announcements.filter((item) => {
    const matchesSearch = `${item.title} ${item.content}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      matchesSearch &&
      (audience === "All audiences" || item.audience === audience)
    );
  });

  function openCreate() {
    setEditing(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setModalOpen(true);
  }

  function openEdit(item: Announcement) {
    setEditing(item);
    setThumbnailFile(null);
    setThumbnailPreview(item.thumbnailUrl);
    setModalOpen(true);
  }

  function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    event.currentTarget.value = "";

    if (file && file.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller.");
      return;
    }

    setError("");
    setThumbnailFile(file);
    setThumbnailPreview(
      file ? URL.createObjectURL(file) : editing?.thumbnailUrl ?? null,
    );
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Community</div>
          <h1>Announcements</h1>
          <p>
            Share service updates, new releases, and moments worth celebrating.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            onClick={openCreate}
            disabled={!isConfigured || !isSignedIn}
          >
            ＋ New announcement
          </button>
        </div>
      </div>
      {!isConfigured && (
        <div className="inline-notice">
          Announcements are shown from the live API. Clerk setup is needed to
          create, edit, or delete them.
        </div>
      )}
      {isConfigured && !isSignedIn && (
        <div className="inline-notice">
          Sign in to create or manage announcements.{" "}
          <Link href="/sign-in">Sign in</Link>
        </div>
      )}
      {error && (
        <div className="inline-error" role="alert">
          {error}
          <button className="button" onClick={() => void loadAnnouncements()}>
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <section className="panel" aria-label="Announcements list">
          <div className="management-toolbar">
            <div className="toolbar-tools">
              <label className="search-box">
                <span className="icon" aria-hidden="true">
                  ⌕
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search announcements..."
                  aria-label="Search announcements"
                />
              </label>
              <select
                className="select-control"
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                aria-label="Filter by audience"
              >
                <option>All audiences</option>
                {audiences.map((value) => (
                  <option key={value} value={value}>
                    {audienceLabel(value)}
                  </option>
                ))}
              </select>
            </div>
            <span className="crumb-current">
              {visibleAnnouncements.length} announcements
            </span>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Announcement</th>
                  <th>Audience</th>
                  <th>Posted</th>
                  <th>Updated</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visibleAnnouncements.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="announcement-thumbnail"
                          src={item.thumbnailUrl}
                          alt=""
                        />
                      ) : (
                        <span className="announcement-thumbnail-empty">
                          No image
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="table-primary">{item.title}</span>
                      <span className="table-secondary">{item.content}</span>
                    </td>
                    <td>{audienceLabel(item.audience)}</td>
                    <td>{formatDate(item.postedAt)}</td>
                    <td>{formatDate(item.updatedAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button"
                          onClick={() => openEdit(item)}
                          disabled={!isConfigured || !isSignedIn}
                        >
                          Edit
                        </button>
                        <button
                          className="button button-danger"
                          onClick={() => void handleDelete(item)}
                          disabled={!isConfigured || !isSignedIn}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!visibleAnnouncements.length && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-results">
                        {search
                          ? "No announcements match your filters."
                          : "No announcements have been published yet."}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>
              Showing {visibleAnnouncements.length} of {announcements.length}{" "}
              announcements
            </span>
            <span>Newest first</span>
          </div>
        </section>
      )}
      {modalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving)
              setModalOpen(false);
          }}
        >
          <form className="modal announcement-modal" onSubmit={handleSubmit}>
            <div className="modal-head">
              <div>
                <h2>{editing ? "Edit announcement" : "New announcement"}</h2>
                <p>Updates are saved directly to the community API.</p>
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
              <label htmlFor="announcement-title">Title</label>
              <input
                id="announcement-title"
                name="title"
                defaultValue={editing?.title ?? ""}
                maxLength={255}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="announcement-content">Message</label>
              <textarea
                id="announcement-content"
                name="content"
                defaultValue={editing?.content ?? ""}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="announcement-slug">URL slug</label>
              <input
                id="announcement-slug"
                name="slug"
                defaultValue={editing?.slug ?? ""}
                maxLength={255}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
              />
              <span className="panel-subtitle">
                Use lowercase letters, numbers, and hyphens.
              </span>
            </div>
            <div className="field">
              <label htmlFor="announcement-audience">Audience</label>
              <select
                id="announcement-audience"
                name="audience"
                defaultValue={editing?.audience ?? "EVERYONE"}
              >
                {audiences.map((value) => (
                  <option key={value} value={value}>
                    {audienceLabel(value)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="announcement-thumbnail">Announcement image</label>
              <input
                id="announcement-thumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleThumbnailChange}
              />
              <span className="panel-subtitle">
                Optional. JPEG, PNG, WebP, or GIF; up to 10 MB.
              </span>
              {thumbnailPreview && (
                <div className="announcement-image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailPreview} alt="Announcement image preview" />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button button-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving…"
                  : editing
                    ? "Save changes"
                    : "Publish announcement"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
