 document.addEventListener('DOMContentLoaded', () => {
    // Reference to the entries container
    const entriesContainer = document.getElementById('entries');
    const addEntryBtn = document.getElementById('add-entry');
    const saveBtn = document.getElementById('save');

    // Create a single entry block
    function createEntry(label = '', value = '') {
        const wrapper = document.createElement('div');
        wrapper.className = 'entry';

        const labelInput = document.createElement('input');
        labelInput.placeholder = 'Label (e.g. Email)';
        labelInput.value = label;

        const valueInput = document.createElement('input');
        valueInput.placeholder = 'Value (e.g. me@email.com)'
        valueInput.value = value;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onClick = () => wrapper.remove;

        wrapper.appendChild(labelInput);
        wrapper.appendChild(valueInput);
        wrapper.appendChild(removeBtn);
        entriesContainer.appendChild(wrapper);
    }

    // Add new entry on button click
    addEntryBtn.addEventListener('click', () => { createEntry();
        console.log("Entry created");
    });

    // Save all entries to Chrome storage
    saveBtn.addEventListener('click', async () => {
        const allEntries = entriesContainer.querySelectorAll('.entry');
        console.log("All entries:", allEntries);
        const dataToSave = {};

        allEntries.forEach(entry => {
            console.log("Current entry:", entry);
            const inputs = entry.querySelectorAll('input');
            console.log("Inputs witjin entry:", inputs);

            const label = inputs[0].value.trim();
            console.log("label:", label);
            const value = inputs[1].value.trim();
            console.log("value:", value);
            if(label && value) {
                dataToSave[label] = value;
            } 
        });

        await chrome.storage.sync.set({ savedEntries: dataToSave });
        alert('Data saved!');
        chrome.runtime.sendMessage({ action: "updateContextMenu" }); // Notify background to update context menu   
    });

    // Load saved data when the page opens
    (async () => {
        const result = await chrome.storage.sync.get('savedEntries');
        const savedEntries = result.savedEntries || {};
        for (const [label, value] of Object.entries(savedEntries)) {
            createEntry(label, value);
        }
    })();
});