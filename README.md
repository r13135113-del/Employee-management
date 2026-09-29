# EmployeeHub — React Employee Management System

A responsive Employee Management System built with React and Vite. Employee data is stored in `db.json` and managed through a JSON Server REST API. Frontend screens, form fields, dashboard statistics, dialog, employee data helpers, and API requests are split into separate files.

## Features

- Create employee records
- Read and search the employee directory
- Update employee details in edit mode
- Confirm before deleting a record
- Form validation with helpful error messages
- Persistent JSON Server data in `db.json`
- Separate frontend API module for backend requests
- Responsive modern interface

## Run locally

1. Open this folder in a terminal.
2. Run `npm install`.
3. Run `npm run dev` to start both JSON Server (`http://localhost:3001`) and the Vite frontend.
4. Open the local address Vite displays in your browser.

You can also run the processes separately with `npm run server` and `npm run dev:web`. The employee REST collection is available at `http://localhost:3001/employees`. Set `VITE_EMPLOYEES_API_URL` in a `.env` file if the API uses a different URL.

For a production build, run `npm run build`.
