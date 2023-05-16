console.log("popup.js: loaded");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("openOptionsPage")?.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
  document.getElementById("openHistoryPage")?.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("history.html") });
  });
});
