import { compareVersions } from "compare-versions";
import { APP_VERSION } from "../config/version";

// Wrap dynamic import() so a failed chunk load (typically caused by a deploy
// replacing bundle hashes the running tab still references) reloads the page
// instead of bubbling to the error boundary. Reloads only when the server
// version differs from the bundled APP_VERSION; otherwise rethrows.
export async function importWithReload<T>(loader: () => Promise<T>): Promise<T> {
  try {
    return await loader();
  } catch (err) {
    const res = await fetch("/api/version").catch(() => null);
    if (res?.ok) {
      const data = (await res.json()) as { version: string };
      if (compareVersions(data.version, APP_VERSION) !== 0) {
        window.location.reload();
        return new Promise<T>(() => {});
      }
    }
    throw err;
  }
}
