chrome.runtime.onInstalled.addListener(() => {
    console.log("Save and Fill Extension Installed");
    chrome.contextMenus.create({
        id: "saveData",
        title: "Save Form Data",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillData",
        title: "Fill Saved Data",
        contexts: ["editable"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "saveData") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => chrome.runtime.sendMessage({ action: "save", data: document.activeElement.value })
        });
    } else if (info.menuItemId === "fillData") {
        let { autofillData } = await chrome.storage.sync.get("autofillData");
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (data) => {
                document.activeElement.value = data;
            },
            args: [autofillData]
        });
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "save") {
        await chrome.storage.sync.set({ autofillData: request.data });
        alert("Data saved!");
    }
})