# FocusFlow — Smart Study Planner

A simple, responsive study planner built with HTML, CSS, and JavaScript to help students organise study tasks, manage deadlines, and track their progress.

## Project Preview

<!-- Keep your existing project preview image or GIF here. -->

## Features

* **Task Management:** Add, edit, and delete study tasks.
* **Subject Organisation:** Organise tasks by subject.
* **Deadline Tracking:** Set deadlines and identify upcoming or overdue tasks.
* **Priority Management:** Assign priorities to tasks.
* **Progress Tracking:** Mark tasks as completed and monitor study progress.
* **Task Filtering:** Filter tasks to find the ones you need.
* **Local Data Storage:** Save tasks in the browser using localStorage.
* **Responsive Interface:** Use the planner on different screen sizes.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Browser localStorage

## Getting Started

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a web browser.

Alternatively, run a local server from the project folder using Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

The website is published using GitHub Pages.

<!-- Add your verified GitHub Pages URL here. -->

## Project Structure

```text
focusflow-study-planner/
├── index.html
├── style.css
├── app.js
└── README.md
```

## AWS Cloud Project: Static Website Hosting

This project also served as a hands-on introduction to Amazon S3 static website hosting.

### Implementation

* Created an Amazon S3 general-purpose bucket in the Sydney region (`ap-southeast-2`).
* Uploaded `index.html`, `style.css`, and `app.js`.
* Enabled static website hosting and configured `index.html` as the index document.
* Reviewed S3 Object Ownership, Block Public Access, and bucket policy settings.
* Investigated the HTTP security warning displayed by the S3 website endpoint.

### Troubleshooting and Lessons Learned

**HTTP security warning**

S3 static website endpoints use HTTP and do not directly support HTTPS. HTTPS requires an appropriate hosting or content-delivery configuration.

**Access control**

S3 access depends on the effective permissions and security configuration. Public access should not be enabled without understanding the security implications.

**Cost awareness**

AWS budgets and alerts help monitor spending but do not automatically stop resource usage. Additional services should be evaluated for eligibility and cost before deployment.

### Current AWS Project Status

The S3 bucket, uploaded website files, and static website hosting configuration are in place. The public-access configuration has not been fully validated, and the S3 website endpoint displays an HTTP security warning.

CloudFront and HTTPS configuration are deferred until account eligibility and pricing can be checked.

## Limitations

* Tasks are stored in the browser's localStorage.
* Tasks do not automatically synchronise across browsers or devices.
* Clearing browser data may remove locally stored tasks.
* The S3 static website endpoint does not provide HTTPS directly.

## Future Improvements

* Explore secure HTTPS delivery after verifying AWS account eligibility and costs.
* Consider cloud-backed data storage and synchronisation if a suitable free option is available.

## Learning Outcomes

* Building a responsive web application with HTML, CSS, and JavaScript.
* Using browser localStorage for persistence.
* Publishing a static website with GitHub Pages.
* Exploring Amazon S3 static website hosting.
* Understanding basic cloud access control, HTTP versus HTTPS, and cost awareness.

## Author

Developed as a hands-on learning project to practise web fundamentals and cloud hosting concepts.
