type Env = {
  APP_URL: string;
  CRON_SECRET: string;
};

export default {
  async scheduled(_event: { cron: string }, env: Env) {
    const response = await fetch(`${env.APP_URL}/api/cron/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.CRON_SECRET}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[cron] owner-daily failed: ${response.status} ${text}`);
    } else {
      console.log("[cron] owner-daily sent successfully");
    }
  },
};
