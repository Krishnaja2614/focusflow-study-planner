## AWS Cloud Project: FocusFlow Static Website Hosting

### Project Overview

FocusFlow is a responsive study planner built with HTML, CSS, and JavaScript. This project explores static website hosting using Amazon S3 and documents cloud configuration, troubleshooting, security, and cost considerations.

### Technologies and Services

* HTML, CSS, and JavaScript
* Amazon S3
* Amazon S3 Static Website Hosting
* GitHub and GitHub Pages

### Implementation

1. Created an Amazon S3 general-purpose bucket in the Sydney region (`ap-southeast-2`).
2. Uploaded `index.html`, `style.css`, and `app.js`.
3. Enabled static website hosting and configured `index.html` as the index document.
4. Reviewed bucket permissions, Block Public Access, Object Ownership, and bucket policy settings.
5. Investigated the HTTP security warning shown by the S3 website endpoint.

### Troubleshooting and Lessons Learned

**Issue: The S3 website endpoint displays an HTTP security warning**

* **Observation:** The S3 static website endpoint uses HTTP.
* **Cause:** S3 website endpoints do not directly support HTTPS.
* **Lesson:** HTTPS requires an additional hosting or content-delivery configuration, such as an appropriately configured CloudFront distribution.

**Access-control considerations**

* Object Ownership is set to Bucket owner enforced, which disables ACLs.
* Block Public Access settings must be reviewed carefully before allowing public access.
* A missing bucket policy alone does not establish whether all access is allowed or denied; the effective configuration determines access.

### Security and Cost Considerations

* Never publish credentials, secrets, or personal information.
* Keep public access restricted unless it is specifically required and appropriately configured.
* Review AWS pricing and account-plan restrictions before enabling additional services.
* A budget alert does not automatically stop resource usage or charges.

### Current Status

The website files have been uploaded and static website hosting has been configured. The S3 website endpoint displays an HTTP security warning, and the public-access configuration has not been fully validated.

The GitHub Pages deployment serves as the public demonstration of FocusFlow. HTTPS through CloudFront may be explored later after checking account eligibility and pricing.

### Key Learning Outcomes

* S3 buckets and objects
* Static website hosting
* Bucket ownership and access-control concepts
* HTTP versus HTTPS
* Cloud troubleshooting and security awareness
* Cloud cost monitoring
