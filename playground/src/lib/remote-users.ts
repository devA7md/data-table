import type { SortingState } from "@tanstack/react-table";

import type { User } from "../data/users";

interface DummyJsonUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
}

export interface RemoteUsersPage {
  users: User[];
  total: number;
}

const roles = ["admin", "editor", "viewer"] as const;

/** Maps table column ids onto the DummyJSON field names they are derived from. */
const sortableFields: Record<string, string> = {
  name: "firstName",
  email: "email",
  createdAt: "birthDate",
};

export interface FetchRemoteUsersOptions {
  skip: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

/**
 * Fetches one page of users from DummyJSON and maps them onto the
 * playground's User shape. `skip`/`limit` mirror the table's pagination
 * state, `sortBy`/`order` its sorting state, and `search` its global filter,
 * so every state change triggers a new request.
 */
export async function fetchRemoteUsersPage(
  { skip, limit, sortBy, order, search }: FetchRemoteUsersOptions,
  signal?: AbortSignal,
): Promise<RemoteUsersPage> {
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  params.set("select", "firstName,lastName,email,birthDate");
  const field = sortBy ? sortableFields[sortBy] : undefined;
  if (field) {
    params.set("sortBy", field);
    params.set("order", order ?? "asc");
  }
  if (search) {
    params.set("q", search);
  }

  const response = await fetch(`https://dummyjson.com/users?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  const json: { users: DummyJsonUser[]; total: number } = await response.json();
  return {
    total: json.total,
    users: json.users.map((user, index) => ({
      id: String(user.id),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: roles[(skip + index) % roles.length],
      status: (skip + index) % 5 === 4 ? "disabled" : "active",
      createdAt: user.birthDate,
    })),
  };
}

export interface UrlTableState {
  pagination?: { pageIndex?: number; pageSize?: number };
  sorting?: SortingState;
  globalFilter?: string;
}

/** Reads page/pageSize/sort/search back from the URL on first load. */
export function readTableStateFromUrl(): UrlTableState {
  const params = new URLSearchParams(window.location.search);
  const state: UrlTableState = {};

  const page = Number(params.get("page"));
  const pageSize = Number(params.get("pageSize"));
  if (Number.isFinite(page) && page > 0) {
    state.pagination = { pageIndex: page - 1 };
  }
  if (Number.isFinite(pageSize) && pageSize > 0) {
    state.pagination = { ...state.pagination, pageSize };
  }

  const sort = params.get("sort");
  if (sort) {
    const [field, direction] = sort.split(".");
    if (field) {
      state.sorting = [{ id: field, desc: direction === "desc" }];
    }
  }

  const search = params.get("search");
  if (search) {
    state.globalFilter = search;
  }

  return state;
}

/** Writes the table's query params into the location URL without navigation. */
export function writeQueryParamsToUrl(params: Record<string, string>): void {
  const query = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}
