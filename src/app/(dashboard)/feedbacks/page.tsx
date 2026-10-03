"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../../components/AdminAuthProvider";
import { TableSkeleton } from "../../../components/LoadingSkeleton";
import { deleteFeedback, fetchFeedback, type Feedback } from "../../../lib/api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function Feedbacks() {
  const { isConfigured, isLoaded, isSignedIn, getToken } = useAdminAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadFeedback = useCallback(async () => {
    if (!isLoaded) return;
    if (!isConfigured || !isSignedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your Clerk session could not be verified.");
      const response = await fetchFeedback(token);
      setFeedback(response.feedbacks);
      setTotal(response.pagination.total);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isConfigured, isLoaded, isSignedIn]);

  useEffect(() => { void loadFeedback(); }, [loadFeedback]);

  async function handleDelete(item: Feedback) {
    if (!window.confirm("Delete this feedback? This cannot be undone.")) return;
    setDeletingId(item.id);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your Clerk session could not be verified.");
      await deleteFeedback(item.id, token);
      setFeedback((current) => current.filter((entry) => entry.id !== item.id));
      setTotal((current) => Math.max(0, current - 1));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to delete feedback.");
    } finally {
      setDeletingId(null);
    }
  }

  const visibleFeedback = feedback.filter((item) =>
    item.message.toLowerCase().includes(search.toLowerCase()),
  );
  const recentCount = feedback.filter(
    (item) => Date.now() - new Date(item.createdAt).getTime() < 7 * 86400000,
  ).length;

  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">Community</div><h1>Feedback</h1><p>Read and manage messages sent by people using the mobile app.</p></div>
      </div>
      <section className="stat-grid feedback-stats" aria-label="Feedback totals">
        <article className="panel stat-card"><span className="stat-label">All submissions</span><div className="stat-value">{loading ? "—" : total.toLocaleString()}</div><div className="stat-foot">Stored feedback records</div></article>
        <article className="panel stat-card"><span className="stat-label">Last 7 days</span><div className="stat-value">{loading ? "—" : recentCount.toLocaleString()}</div><div className="stat-foot">Based on submission timestamps</div></article>
      </section>
      {!isConfigured && <div className="inline-notice">Clerk keys are required to load admin feedback. <Link href="/sign-in">Open sign-in</Link></div>}
      {isConfigured && isLoaded && !isSignedIn && <div className="inline-notice">Sign in with an administrator account to view feedback. <Link href="/sign-in">Sign in</Link></div>}
      {error && <div className="inline-error" role="alert">{error}<button className="button" onClick={() => void loadFeedback()}>Retry</button></div>}
      {loading ? <TableSkeleton /> : isConfigured && isSignedIn && <section className="panel" aria-label="Feedback submissions">
        <div className="management-toolbar"><div className="toolbar-tools"><label className="search-box"><span className="icon" aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search feedback..." aria-label="Search feedback" /></label></div><span className="crumb-current">{visibleFeedback.length} shown</span></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Message</th><th>Submitted</th><th>Record</th><th aria-label="Actions" /></tr></thead><tbody>
          {visibleFeedback.map((item) => <tr key={item.id}><td className="feedback-message">{item.message}</td><td>{formatDate(item.createdAt)}</td><td>#{item.id}</td><td><button className="button button-danger" disabled={deletingId === item.id} onClick={() => void handleDelete(item)}>{deletingId === item.id ? "Deleting…" : "Delete"}</button></td></tr>)}
          {!visibleFeedback.length && <tr><td colSpan={4}><div className="empty-results">{search ? "No feedback matches your search." : "No feedback has been submitted yet."}</div></td></tr>}
        </tbody></table></div>
        <div className="table-footer"><span>Showing {visibleFeedback.length} of {total} submissions</span><span>Newest first</span></div>
      </section>}
    </>
  );
}
