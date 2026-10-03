export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://frehaymanot-backend.vercel.app/api";

type ApiOptions = Omit<RequestInit, "headers"> & {
  token?: string | null;
  headers?: HeadersInit;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const { token, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  if (!(requestOptions.body instanceof FormData) && requestOptions.body) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: requestHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(result?.message ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export type Announcement = {
  id: number;
  title: string;
  slug: string;
  content: string;
  audience: "YOUTH" | "CENTRAL" | "CHILDREN" | "EVERYONE";
  thumbnailUrl: string | null;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Feedback = {
  id: number;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type ContentRecord = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementInput = Pick<
  Announcement,
  "title" | "slug" | "content" | "audience"
>;

type AnnouncementListResponse = {
  announcements: Announcement[];
  pagination: { hasMore: boolean };
};

export async function fetchAnnouncements(token?: string | null) {
  const announcements: Announcement[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await apiRequest<AnnouncementListResponse>(
      `/announcements?page=${page}&pageSize=100`,
      { token },
    );
    announcements.push(...response.announcements);
    hasMore = response.pagination.hasMore;
    page += 1;
  }

  return announcements;
}

export async function fetchFeedback(token: string) {
  const feedbacks: Feedback[] = [];
  let page = 1;
  let total = 0;

  do {
    const response = await apiRequest<{
      feedbacks: Feedback[];
      pagination: { total: number };
    }>(`/feedback?page=${page}&limit=100&sort=desc`, { token });
    feedbacks.push(...response.feedbacks);
    total = response.pagination.total;
    page += 1;
    if (response.feedbacks.length === 0) break;
  } while (feedbacks.length < total);

  return { feedbacks, pagination: { total } };
}

export async function deleteFeedback(id: number, token: string) {
  return apiRequest<{ feedback: Feedback }>(`/feedback/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function createAnnouncement(
  input: AnnouncementInput,
  token: string,
  thumbnail?: File | null,
) {
  const body = new FormData();
  body.set("title", input.title);
  body.set("slug", input.slug);
  body.set("content", input.content);
  body.set("audience", input.audience);
  if (thumbnail) body.set("thumbnail", thumbnail);

  return apiRequest<{ announcement: Announcement }>("/announcements", {
    method: "POST",
    token,
    body,
  });
}

export async function updateAnnouncement(
  id: number,
  input: AnnouncementInput,
  token: string,
  thumbnail?: File | null,
) {
  const body = new FormData();
  body.set("title", input.title);
  body.set("slug", input.slug);
  body.set("content", input.content);
  body.set("audience", input.audience);
  if (thumbnail) body.set("thumbnail", thumbnail);

  return apiRequest<{ announcement: Announcement }>(`/announcements/${id}`, {
    method: "PATCH",
    token,
    body,
  });
}

export async function deleteAnnouncement(id: number, token: string) {
  return apiRequest<{ announcement: Announcement }>(`/announcements/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function fetchDashboardContent() {
  const [mezmurResponse, courseResponse, announcements] = await Promise.all([
    apiRequest<{ mezmurs: ContentRecord[] }>("/mezmur"),
    apiRequest<{ courses: ContentRecord[] }>("/course"),
    fetchAnnouncements(),
  ]);

  return {
    mezmurs: mezmurResponse.mezmurs,
    courses: courseResponse.courses,
    announcements,
  };
}
