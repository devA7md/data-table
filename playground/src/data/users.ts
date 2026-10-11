export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "invited" | "disabled";
  createdAt: string;
}

const firstNames = [
  "Ava",
  "Liam",
  "Noah",
  "Maya",
  "Omar",
  "Elena",
  "Kai",
  "Zara",
  "Ivan",
  "Nina",
  "Leo",
  "Sara",
  "Hugo",
  "Ines",
  "Ravi",
  "Tara",
  "Felix",
  "Mira",
  "Jonas",
  "Lena",
];
const lastNames = [
  "Smith",
  "Chen",
  "Novak",
  "Haddad",
  "Rossi",
  "Kim",
  "Dubois",
  "Silva",
  "Weber",
  "Katz",
];
const roles: User["role"][] = ["admin", "editor", "viewer"];
const statuses: User["status"][] = ["active", "invited", "disabled"];

export function createUsers(count = 87): User[] {
  return Array.from({ length: count }, (_, i) => {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    return {
      id: `usr_${String(i + 1).padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/ /g, ".")}@example.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      createdAt: new Date(Date.now() - i * 86_400_000 * 3).toISOString().slice(0, 10),
    };
  });
}
