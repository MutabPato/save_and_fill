🧠 Overview
Save and Fill is a Chrome extension that increases productivity by letting users save labeled text data (like names, addresses, templates, etc.) which can later be autofilled into form fields via context menus on any website.

🔧 How It Works – User Flow
User visits the extension's data entry page (data.html or a similar custom page).

Each entry has:

A label field (e.g. “Work Email”).

A value field (e.g. me@work.com).

Users can duplicate this entry pair as needed to save multiple fields.

A “Save” button stores this labeled data to Chrome’s storage.

User right-clicks (context menu) on any editable field on another site.

They’ll see a “Fill Saved Data” option.

Hovering reveals sub-options labeled by the keys they saved.

Clicking a label autofills the value into the field.

Popup page (optional but useful):

Briefly explains the extension.

Optionally links to the data entry page.

Can offer a “sync data” or “clear saved data” button.

🧩 Key Components
Component	File	Functionality
manifest.json	Defines permissions, files used (popup, background, etc.)	
background.js	Creates and updates context menus dynamically using saved data	
popup.html	A small, optional popup to explain the extension and link to settings	
data.html + data.js	Main UI to allow the user to save labeled data pairs	
content.js	Injected into pages to allow data injection into input fields	
💡 Example Use Case
Patrick enters the label “Phone Number” and value “+254 712 345678” on the settings page.
Later, he visits a form on another site.
He right-clicks a phone number field, sees “Fill Saved Data > Phone Number”, clicks it, and the number is autofilled.