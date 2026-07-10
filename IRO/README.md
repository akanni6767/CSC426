# IRO - Issues Reporting Outlet

A simple, client-side-only issue reporting and tracking application. IRO allows users to report issues within a community and provides a dashboard for viewing, filtering, and managing these reports.

This project is built with vanilla JavaScript, HTML, and CSS, and it uses the browser's `localStorage` for data persistence. This means all data stays on the user's device and there is no server or database involved.

## Features

- **Tabbed Interface**: Easily switch between the issue submission form and the management dashboard.
- **Issue Submission Form**:
    - Report issues with details like title, description, category, urgency, and community.
    - Fields for reporter's name and type (e.g., Student, Staff). Name can be left blank for an "Anonymous" submission.
    - Basic form validation to ensure all required fields are completed.
    - Success message upon submission with a unique report ID.
- **Dashboard**:
    - **At-a-Glance Statistics**: View the total number of issues, and counts for "Open", "In Progress", and "Resolved" statuses.
    - **Dynamic Filtering**: Filter the list of issues by their status or community.
    - **Issue List**: Displays all reported issues as cards, with the newest first.
    - **Status Management**: Update the status of any issue directly from its card on the dashboard. Changes are saved instantly.
- **Data Management**:
    - **Export to JSON**: Download all issue data as a single `iro_issues.json` file.
    - **Clear Data**: Permanently delete all stored reports from the browser's storage.
- **Client-Side Storage**: All data is stored in the browser's `localStorage`, persisting across sessions on the same device and browser.

## Technology Stack

- **JavaScript (Vanilla)**: Handles all application logic, from form submission to rendering the dashboard and managing data.
- **HTML5**: Provides the structure for the application.
- **CSS3**: Styles the application for a clean and user-friendly interface.

## How It Works

The application is entirely self-contained and runs in the web browser.

1.  **Data Storage**: All issue reports are stored as a single JSON string in the browser's `localStorage` under the key `iro_issues`.
2.  **Data Manipulation**: When the application loads or when data is updated (e.g., a new issue is submitted or a status is changed), the JavaScript code reads this JSON string, parses it into a JavaScript array, performs the necessary operations, and then saves the updated array back to `localStorage` by converting it back into a JSON string.
3.  **Persistence**: Because `localStorage` is used, the data remains available even if you close the browser tab or window. However, it is specific to the browser and device you are using. Clearing your browser's cache or storage may delete the data.

## Getting Started

Since this is a front-end-only project, there is no build process or server setup required.

1.  Clone or download the repository.
2.  Open the `index.html` file in any modern web browser.

That's it! You can now start reporting and managing issues.

## Code Overview (`script.js`)

The JavaScript is organized into several logical sections:

- **Storage Helpers**: Functions (`getIssues`, `saveIssues`) for reading from and writing to `localStorage`, handling JSON serialization and deserialization.
- **Tab Switching**: Logic to manage the active state of the main tabs ("Report an Issue" and "Dashboard").
- **Report Form**: An event listener for the form submission that validates input, creates a new issue object, and saves it.
- **Dashboard**:
    - The main `renderDashboard` function is the heart of the application's display logic.
    - It calculates and displays statistics.
    - It filters the issues based on the selected filter values.
    - It dynamically generates and renders the HTML for the list of issue cards.
    - It attaches event listeners to the status `<select>` dropdowns on each card to handle status updates.
- **Export / Clear**: Event listeners for the export and clear buttons to manage the application's data.
- **Init**: An initial call to `renderDashboard()` to populate the dashboard when the page first loads.

---

*This project serves as a prototype to demonstrate front-end application logic and data management without a backend.*