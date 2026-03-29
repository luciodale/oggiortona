type PushResult = {
  success: boolean;
  status: number;
};

type SettledResult = PromiseSettledResult<PushResult>;

export function extractStaleEndpoints(
  endpoints: ReadonlyArray<string>,
  results: ReadonlyArray<SettledResult>,
): Array<string> {
  const stale: Array<string> = [];
  for (const [i, result] of results.entries()) {
    if (result.status === "fulfilled" && !result.value.success) {
      const { status } = result.value;
      if (status === 410 || status === 404) {
        const endpoint = endpoints[i];
        if (endpoint) stale.push(endpoint);
      }
    }
  }
  return stale;
}
