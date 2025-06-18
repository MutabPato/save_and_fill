 document.addEventListener('DOMContentLoaded', () => {
    
    //Select form and buttons
    const form = document.getElementById('dataForm');
    const addEntryBtn = document.getElementById('add-entry');

    // Create a single entry block
    function createEntryRow(label = '', value = '') {
        const row = document.createElement('div');
        row.className = 'entry-row';

        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.placeholder = 'Label';
        labelInput.className = 'label-input';
        labelInput.value = label;

        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = 'Value';
        valueInput.className = 'value-input';
        valueInput.value = value;

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', () => {
            console.log('Remove button clicked');
            row.remove();
        });

        row.appendChild(labelInput);
        row.appendChild(valueInput);
        row.appendChild(removeBtn);
        
        form.insertBefore(row, form.querySelector('.buttons'));
    }

    // Add new entry on button click
    addEntryBtn.addEventListener('click', () => { 
        createEntryRow();
        console.log("Entry created");
    });

    // Handle for submission and save data
    form.addEventListener('submit', async (e) =>{
        e.preventDefault();

        const labels = document.querySelectorAll('.label-input');
        const values = document.querySelectorAll('.value-input');
        const dataToSave = {};

        let hasEmpty = false;

        labels.forEach((labelInput, index) => {
            const label = labelInput.value.trim();
            const value = values[index].value.trim(); 

            if(label && value) {
                dataToSave[label] = value;
            } else {
                hasEmpty = false;
            }
        });

        if (Object.keys(dataToSave).length === 0) {
            alert("Please fill at least one complete entry");
            return;
        }

        if (hasEmpty) {
            if(!confirm("Some entries are incomplete. Do you want to save only")){
                return;
            }
        }
        await chrome.storage.sync.set({ autofillData: dataToSave });
        alert("Data saved successfully!");
        chrome.runtime.sendMessage({ action: 'updateContextMenu' }); // Notify background to update contextMenus
    });

    // Load saved data when the page opens
    (async () => {
        const result = await chrome.storage.sync.get('autofillData');
        const savedData = result.autofillData || {};
        
       if (Object.keys(savedData).length > 0) {
        for (const [label, value] of Object.entries(savedData)) {
            createEntryRow(label, value);
        }
       } else {
        // Add one blank row if no saved data exists
        createEntryRow();
       }
    })();
});