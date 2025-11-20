import type { JobApplication } from "../types";

export const CURRENT_SCHEMA_VERSION = 2;

type Migration = {
  version: number;
  migrate: (data: any) => any;
};

// list of migrations to apply in order
const migrations: Migration[] = [
  {
    version: 2,
    migrate: (app: any): JobApplication => {
      return {
        ...app,
        schemaVersion: 2,
        priority: app.priority || "medium",
        source: app.source || "manual",
        remote: app.remote || "unknown",
        techStack: app.techStack || [],
        archived: app.archived || false,
      };
    },
  },
  // New migrations can be added here
];

// Function to migrate a single application
export function migrateApplication(app: any): JobApplication {
  // Determine the current version of the application
  const appVersion = app.schemaVersion || 1;

  // If already up-to-date, return as is
  if (appVersion >= CURRENT_SCHEMA_VERSION) {
    return app as JobApplication;
  }

  // Apply all necessary migrations
  let migratedApp = { ...app };
  for (const migration of migrations) {
    if (migration.version > appVersion) {
      migratedApp = migration.migrate(migratedApp);
    }
  }

  return migratedApp;
}

// Function to migrate all applications
export function migrateAllApplications(apps: any[]): JobApplication[] {
  return apps.map(migrateApplication);
}
