document.getElementById("saveData").addEventListener("click", async () => {
    let data = document.getElementById("fieldData").ariaValueMax;
    await chrome.storage.sync.set({ autofill: data});
    alert("Data saved!");
});

document.getElementById("fillData").addEventListener("click", async() => {
    let { autofillData } = chrome.storage.sync.get("autofillData");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (data) => {
                document.activeElement.value = data;
            },
            args: [autofillData]
        });
    });
})