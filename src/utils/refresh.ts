export function initRefreshButton() {
  const btn = document.getElementById("refresh-btn");
  btn?.addEventListener("click", async () => {
    btn.querySelector("svg")?.classList.add("animate-spin");
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.update();
    window.location.reload();
  });
}
