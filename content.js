chrome.runtime.onMessage.addListner((request, sender, sendResponse) => {
    if (request.action === "fill") {
        document.activeElement.value = request.data;
    }
});