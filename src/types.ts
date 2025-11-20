export interface JobApplication {
  id: string;
  schemaVersion?: number;
  createdAt: string;
  updatedAt: string;

  companyName: string;
  jobTitle: string;
  location: string;
  contactEmail: string;
  jobLink: string;
  applicationDate: string;
  status: ApplicationStatus;
  notes: string;

  attachmentName?: string;
  salary?: string;
  contractType?: ContractType;
  remote?: RemoteType;
  techStack?: string[];

  priority: Priority;
  archived: boolean;

  source: ApplicationSource;
}

export interface FilterState {
  searchTerm: string;
  status: ApplicationStatus | "all";
  contractType: ContractType | "all";
  location: string;
  dateFrom: string;
  priority?: Priority | "all";
  remote?: RemoteType | "all";
  tags?: string[];
  archived?: boolean;
}

export type ApplicationStatus =
  | "to_send"
  | "sent"
  | "follow_up"
  | "rejected"
  | "interview"
  | "offer_received";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  to_send: "À envoyer",
  sent: "Envoyée",
  follow_up: "Relance",
  rejected: "Refus",
  interview: "Entretien",
  offer_received: "Offre reçue",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  to_send: "bg-zinc-400",
  sent: "bg-blue-400/70",
  follow_up: "bg-amber-300/70",
  rejected: "bg-red-400/70",
  interview: "bg-purple-400/70",
  offer_received: "bg-emerald-400/70",
};

export type ContractType =
  | "cdi"
  | "cdd"
  | "freelance"
  | "internship"
  | "temporary"
  | "apprenticeship";

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  cdi: "CDI",
  cdd: "CDD",
  freelance: "Freelance",
  internship: "Stage",
  temporary: "Intérim",
  apprenticeship: "Apprentissage",
};

export type Priority = "low" | "medium" | "high";

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "text-gray-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

export type RemoteType = "full" | "hybrid" | "none" | "unknown";

export const REMOTE_LABELS: Record<RemoteType, string> = {
  full: "Full remote",
  hybrid: "Hybride",
  none: "Présentiel",
  unknown: "Non précisé",
};

export type ApplicationSource =
  | "manual"
  | "hellowork"
  | "import"
  | "linkedin"
  | "indeed"
  | "wttj"
  | "other";

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  manual: "Ajout manuel",
  hellowork: "HelloWork",
  import: "Import",
  linkedin: "LinkedIn",
  indeed: "Indeed",
  wttj: "Welcome to the Jungle",
  other: "Autre",
};

export type TechStack =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "cplusplus"
  | "ruby"
  | "go"
  | "php";

export const TECH_STACK_LABELS: Record<TechStack, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  cplusplus: "C++",
  ruby: "Ruby",
  go: "Go",
  php: "PHP",
};
