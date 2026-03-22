async function hardRefreshActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    // Clear browser cache first
    await chrome.browsingData.removeCache({ since: 0 });

    // Reload active tab bypassing cache
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  } catch (err) {
    console.error('Hard refresh failed:', err);
  }
}

chrome.action.onClicked.addListener(() => {
  hardRefreshActiveTab();
});
