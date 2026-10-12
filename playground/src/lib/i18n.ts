import { useCallback } from "react";

import type { TableMessageKey, TableTranslator } from "@/table";

export type Lang = "en" | "ar";

export const messages: Record<Lang, Record<TableMessageKey, string>> = {
  en: {
    columns: "Columns",
    toggle_columns: "Toggle columns",
    rows_per_page: "Rows per page",
    page_of: "Page {page} of {total}",
    go_to_first_page: "Go to first page",
    go_to_previous_page: "Go to previous page",
    go_to_next_page: "Go to next page",
    go_to_last_page: "Go to last page",
    sort_ascending: "Sort ascending",
    sort_descending: "Sort descending",
    clear_sort: "Clear sort",
    search_placeholder: "Search...",
    no_results: "No results.",
  },
  ar: {
    columns: "الأعمدة",
    toggle_columns: "إظهار / إخفاء الأعمدة",
    rows_per_page: "صفوف في الصفحة",
    page_of: "صفحة {page} من {total}",
    go_to_first_page: "الانتقال إلى الصفحة الأولى",
    go_to_previous_page: "الانتقال إلى الصفحة السابقة",
    go_to_next_page: "الانتقال إلى الصفحة التالية",
    go_to_last_page: "الانتقال إلى الصفحة الأخيرة",
    sort_ascending: "ترتيب تصاعدي",
    sort_descending: "ترتيب تنازلي",
    clear_sort: "إزالة الترتيب",
    search_placeholder: "بحث...",
    no_results: "لا توجد نتائج.",
  },
};

/** Playground-specific strings (column headers, page chrome) — outside the table's key set. */
export const labels: Record<
  Lang,
  {
    heading: string;
    subheading: string;
    internalHeading: string;
    internalSubheading: string;
    externalHeading: string;
    externalSubheading: string;
    columns: Record<"name" | "email" | "role" | "status" | "createdAt", string>;
    actions: Record<"view" | "edit" | "reset" | "disable", string>;
    roles: Record<"admin" | "editor" | "viewer", string>;
    clearFilter: string;
    queryParams: string;
    loadError: string;
  }
> = {
  en: {
    heading: "Data Table Playground",
    subheading:
      "Sorting, global search, column filters, pagination, row selection, and row actions.",
    internalHeading: "Internal table",
    internalSubheading: "The Table component creates and owns the table instance.",
    externalHeading: "External table (useTable)",
    externalSubheading:
      "The table instance is built with the useTable hook and passed in; query params below mirror what a server request would use.",
    columns: {
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      createdAt: "Created at",
    },
    actions: {
      view: "View profile",
      edit: "Edit user",
      reset: "Reset password",
      disable: "Disable user",
    },
    roles: { admin: "Admin", editor: "Editor", viewer: "Viewer" },
    clearFilter: "Clear filter",
    queryParams: "Query params",
    loadError: "Failed to load users. Is the network reachable?",
  },
  ar: {
    heading: "ساحة تجربة جدول البيانات",
    subheading: "ترتيب، بحث شامل، فلاتر الأعمدة، ترقيم الصفحات، تحديد الصفوف، وإجراءات الصفوف.",
    internalHeading: "جدول داخلي",
    internalSubheading: "مكوّن Table ينشئ نسخة الجدول ويديرها.",
    externalHeading: "جدول خارجي (useTable)",
    externalSubheading:
      "يتم إنشاء نسخة الجدول عبر خطاف useTable وتمريرها؛ المعاملات أدناه تحاكي ما يرسل إلى الخادم.",
    columns: {
      name: "الاسم",
      email: "البريد الإلكتروني",
      role: "الدور",
      status: "الحالة",
      createdAt: "تاريخ الإنشاء",
    },
    actions: {
      view: "عرض الملف",
      edit: "تعديل المستخدم",
      reset: "إعادة تعيين كلمة المرور",
      disable: "تعطيل المستخدم",
    },
    roles: { admin: "مدير", editor: "محرر", viewer: "مشاهد" },
    clearFilter: "مسح الفلتر",
    queryParams: "معاملات الاستعلام",
    loadError: "تعذر تحميل المستخدمين. هل الشبكة متاحة؟",
  },
};

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** Returns the table translator for the current language, re-created when the language changes. */
export function useTranslator(lang: Lang): TableTranslator {
  return useCallback(
    (key: TableMessageKey, params?: Record<string, string | number>) =>
      interpolate(messages[lang][key], params),
    [lang],
  );
}
