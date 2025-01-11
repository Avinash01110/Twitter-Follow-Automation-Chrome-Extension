export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "reloadPage") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => location.reload(),
          });
        }
      });
      sendResponse({ status: "Page reload triggered" });
    }
  });
  

});