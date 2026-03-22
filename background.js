async function clearCurrentOriginData(tabUrl) {
  const url = new URL(tabUrl);

  // Skip chrome://, edge://, etc.
  if (!url.origin || url.origin === 'null' || !/^https?:/.test(url.protocol)) {
    return;
  }

  // Try origin-scoped removal first (best effort for current site only)
  await chrome.browsingData.remove(
    { origins: [url.origin], since: 0 },
    {
      cache: true,
      cacheStorage: true,
      serviceWorkers: true,
      indexedDB: true,
      localStorage: true,
      webSQL: true,
      fileSystems: true,
    }
  );
}

async function hardRefreshActiveTabOnly() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) return;

    // Clear current-site data (best effort)
    await clearCurrentOriginData(tab.url);

    // Hard reload this current tab only
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  } catch (err) {
    console.error('TabZap hard refresh failed:', err);
  }
}

chrome.action.onClicked.addListener(() => {
  hardRefreshActiveTabOnly();
});
