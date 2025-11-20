import { useState, useEffect } from "react";
import type { JobApplication } from "../types";
import { dbService } from "../services/db";
import { CURRENT_SCHEMA_VERSION } from "../services/migrations";

export function useIndexedDB() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      await dbService.init();
      await loadApplications();
    } catch (err) {
      setError("Erreur lors de l'initialisation de la base de données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const apps = await dbService.getAllApplications();
      setApplications(
        apps.sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
        )
      );
    } catch (err) {
      setError("Erreur lors du chargement des candidatures");
      console.error(err);
    }
  };

  const addApplication = async (
    application: Omit<
      JobApplication,
      "id" | "createdAt" | "updatedAt" | "schemaVersion"
    >
  ) => {
    try {
      const now = new Date().toISOString();
      const newApp: JobApplication = {
        ...application,
        id: crypto.randomUUID(),
        schemaVersion: CURRENT_SCHEMA_VERSION,
        createdAt: now,
        updatedAt: now,
        priority: application.priority || "medium",
        source: application.source || "manual",
        remote: application.remote || "unknown",
        techStack: application.techStack || [],
        archived: application.archived || false,
      };
      await dbService.addApplication(newApp);
      await loadApplications();
      return newApp;
    } catch (err) {
      // ...
    }
  };

  const updateApplication = async (application: JobApplication) => {
    try {
      const updatedApp = {
        ...application,
        updatedAt: new Date().toISOString(),
      };
      await dbService.updateApplication(updatedApp);
      await loadApplications();
    } catch (err) {
      setError("Erreur lors de la mise à jour de la candidature");
      console.error(err);
      throw err;
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      await dbService.deleteApplication(id);
      await loadApplications();
    } catch (err) {
      setError("Erreur lors de la suppression de la candidature");
      console.error(err);
      throw err;
    }
  };

  const exportData = async () => {
    try {
      const data = await dbService.exportData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job-lens-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Erreur lors de l'export des données");
      console.error(err);
      throw err;
    }
  };

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as JobApplication[];
      await dbService.importData(data);
      await loadApplications();
    } catch (err) {
      setError("Erreur lors de l'import des données");
      console.error(err);
      throw err;
    }
  };

  const clearAllData = async () => {
    try {
      await dbService.clearAllData();
      await loadApplications();
    } catch (err) {
      setError("Erreur lors de la suppression des données");
      console.error(err);
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    exportData,
    importData,
    clearAllData,
    refreshApplications: loadApplications,
  };
}
