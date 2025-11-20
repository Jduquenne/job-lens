import type { JobApplication } from "../types";
import { migrateAllApplications, CURRENT_SCHEMA_VERSION } from "./migrations";

const isDevelopment =
  import.meta.env.MODE === "development" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const DB_NAME = isDevelopment ? "JobLensDB-dev" : "JobLensDB-prod";
const DB_VERSION = 2;
const STORE_NAME = "applications";

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log(
          `📦 Database initialized: ${DB_NAME} (${
            isDevelopment ? "DEV" : "PROD"
          })`
        );
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          objectStore.createIndex("companyName", "companyName", {
            unique: false,
          });
          objectStore.createIndex("status", "status", { unique: false });
          objectStore.createIndex("applicationDate", "applicationDate", {
            unique: false,
          });
          objectStore.createIndex("location", "location", { unique: false });
        }
      };
    });
  }

  private getStore(mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) throw new Error("Database not initialized");
    const transaction = this.db.transaction([STORE_NAME], mode);
    return transaction.objectStore(STORE_NAME);
  }

  async getAllApplications(): Promise<JobApplication[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readonly");
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Appliquer les migrations automatiquement
        const apps = request.result;
        const migratedApps = migrateAllApplications(apps);

        // Sauvegarder les apps migrées si nécessaire
        const needsSave = apps.some(
          (app: any, idx: number) =>
            app.schemaVersion !== migratedApps[idx].schemaVersion
        );

        if (needsSave) {
          this.saveMigratedApps(migratedApps);
        }

        resolve(migratedApps);
      };
    });
  }

  async getApplication(id: string): Promise<JobApplication | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readonly");
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addApplication(application: JobApplication): Promise<string> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readwrite");
      const request = store.add(application);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(application.id);
    });
  }

  async updateApplication(application: JobApplication): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readwrite");
      const request = store.put(application);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteApplication(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readwrite");
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async exportData(): Promise<JobApplication[]> {
    return this.getAllApplications();
  }

  async importData(applications: JobApplication[]): Promise<void> {
    const store = this.getStore("readwrite");

    // Clear existing data
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onerror = () => reject(clearRequest.error);
      clearRequest.onsuccess = () => resolve();
    });

    // Add all imported applications
    const promises = applications.map(
      (app) =>
        new Promise<void>((resolve, reject) => {
          const request = store.add(app);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        })
    );

    await Promise.all(promises);
  }

  async clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("readwrite");
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async saveMigratedApps(apps: JobApplication[]): Promise<void> {
    const store = this.getStore("readwrite");
    const promises = apps.map(
      (app) =>
        new Promise<void>((resolve, reject) => {
          const request = store.put(app);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        })
    );
    await Promise.all(promises);
    console.log(
      `✅ Migrated ${apps.length} applications to schema v${CURRENT_SCHEMA_VERSION}`
    );
  }

  getCurrentDBName(): string {
    return DB_NAME;
  }

  isDevelopment(): boolean {
    return isDevelopment;
  }
}

export const dbService = new IndexedDBService();
