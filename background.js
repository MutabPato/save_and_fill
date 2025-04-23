// Runs when the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(async () => {
    console.log("Save and Fill Extension Installed");
    createContextMenu(); // Create context menu items
});

// Helper: Create context menu based on saved data
async function createContextMenu() {
    chrome.contextMenus.removeAll(); // Clear existing menu items

    // Root context menu item for autofill
    chrome.contextMenus.create({
        id: "fillData",
        title: "Fill Saved Data",
        contexts: ["editable"]
    });

    // Load saved entries from storage
    chrome.storage.sync.get("savedEntries", (result) => {
        const entries = result.savedEntries || {};

        // Create submenus for each entry
        Object.keys(entries).forEach((label) => {
            chrome.contextMenus.create({
                id: `fillData_${label}`,
                parentId: "fillData",
                title: label,
                contexts: ["editable"]
            });
        });
    });
}

// Listener: Handles clicks on context menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId.startsWith("fillData_")) {
        const label = info.menuItemId.replace("fillData_", "");

        chrome.storage.sync.get("savedEntries", (result) => {
            const value = result.savedEntries?.[label];

            if(value) {
                // Inject code to fill active input field
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: (val) => {
                        const active = document.activeElement;
                        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" )) {
                            active.value = val;
                        }
                    },
                    args: [value]
                });
            }
        });
    }
});

// Listener: Rebuild context menu when notified from data.js
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    if (message.action === "updateContextMenu") {
        createContextMenu();
    }
});