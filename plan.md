# Resource Hub External API Plan

This document outlines a backend API design for **Resource Hub** assuming the database layer is moved into a separate service. The goal is to let the existing Next.js frontend talk to a clean HTTP API instead of accessing Prisma or the DB directly.

---

## 1. Goals and Constraints

- Decouple frontend from database and ORM details.
- Support current user flows for **students** and **contributors**:
  - Authentication for both roles.
  - Browsing resources by department, growth category, and level.
  - Uploading resources (contributors only) with file storage.
  - Viewing growth content (career, spiritual, personal) backed by resources.
- Keep the API **RESTful**, JSON-based, and easy to version (`/api/v1`).
- Allow future non-Next.js clients (mobile apps, admin tools) to reuse the same API.

---

## 2. High-Level Architecture

- **Frontend (Next.js)**:
  - No direct DB or Prisma access.
  - Uses `fetch`/HTTP to call the external API.
  - Handles UI state, routing, and presentation.

- **Backend API Service**:
  - Exposes REST endpoints under `/api/v1`.
  - Owns database access (Prisma or other ORM) and file storage integration.
  - Responsible for authentication, authorization, validation, and business rules.

- **Storage**:
  - Database for `User`, `Resource`, etc.
  - File storage for uploaded resources (could stay as local `uploads/` in MVP, or move to S3/Blob).

Authentication between frontend and backend will use a **token-based approach** (JWT access tokens returned on login, stored in httpOnly cookies or forwarded as `Authorization: Bearer <token>` headers).

---

## 3. Core Domain Objects

These mirror the current Prisma models but are expressed as API-level resources.

### User

- Fields (minimum):
  - `id: string`
  - `email: string`
  - `name?: string`
  - `role: "STUDENT" | "CONTRIBUTOR" | "ADMIN"`
  - `department?: string` (students)
  - `accessKey?: string` (contributors, internal only; never returned to clients)

### Resource

- Fields (minimum):
  - `id: string`
  - `title: string`
  - `description?: string`
  - `type: "DOCUMENT" | "VIDEO"`
  - `url: string` (download/view URL for file or external video link)
  - `downloads: number`
  - `category?: "Spiritual" | "Personal" | "Career"`
  - `department?: string` (e.g. "Pharmacy", "Law")
  - `level?: string` (e.g. "Level 200", "Level 500")
  - `createdAt: string` (ISO)
  - `uploader?: { id: string; name?: string; email?: string }`

### Auxiliary

- Departments and growth categories may be served from API for consistency with frontend constants:
  - `Department { id: string; name: string }`
  - `GrowthCategory { id: string; name: string }`

---

## 4. Authentication & Authorization

### 4.1 Login Endpoints

Student and contributor login share the same underlying user model but differ in fields and rules.

#### POST `/api/v1/auth/login`

- **Request body (JSON)**
  - Common:
    - `email: string`
    - `password: string`
  - Optional contributor-only:
    - `accessKey?: string`

- **Behavior**
  - Look up user by `email`.
  - Verify password.
  - If `user.role === "CONTRIBUTOR"` and `accessKey` is provided, compare with stored key.
  - On success:
    - Issue JWT access token (and optional refresh token).
    - Return user summary.

- **Response (200)**
  ```json
  {
    "token": "<jwt-access-token>",
    "user": {
      "id": "user-id",
      "email": "user@university.edu",
      "name": "Alice Student",
      "role": "STUDENT",
      "department": "Computer Science"
    }
  }
  ```

- **Errors**
  - 401 for invalid credentials or access key mismatch.

#### POST `/api/v1/auth/logout`

- For token-based auth, this can be a no-op on the server, invalidating refresh tokens if used. Frontend clears local auth state/cookies.

#### GET `/api/v1/auth/me`

- **Auth**: `Authorization: Bearer <token>`
- Returns the currently authenticated user, or 401 if invalid/expired.

---

## 5. Resource API

These endpoints cover the flows currently seen in departments and growth pages, plus uploads.

### 5.1 List resources

#### GET `/api/v1/resources`

- **Query params** (all optional):
  - `department`: filter by department (e.g. `Pharmacy`, `Law`).
  - `category`: filter by growth category (`spiritual|personal|career` or label form).
  - `level`: filter by level label (e.g. `Level 200`).
  - `type`: `document|video`.
  - `sort`: `recent|popular` (maps to `createdAt` or `downloads`).
  - `limit`, `offset` or `page`, `pageSize` for pagination.

- **Response (200)**
  ```json
  {
    "items": [
      {
        "id": "res-id",
        "title": "Intro to Algorithms Notes",
        "type": "DOCUMENT",
        "downloads": 42,
        "url": "/uploads/sample-intro-to-algorithms.pdf",
        "category": "Career",
        "department": "Computer Science",
        "level": "Level 200",
        "createdAt": "2026-01-21T00:00:00.000Z",
        "uploader": {
          "id": "user-id",
          "name": "Dr. Bob Smith"
        }
      }
    ],
    "total": 1
  }
  ```

### 5.2 Get a single resource

#### GET `/api/v1/resources/:id`

- Returns the resource details.

### 5.3 Upload a resource (Contributor)

#### POST `/api/v1/resources`

- **Auth**: Contributor only.
- **Content-Type**: `multipart/form-data`
  - Fields:
    - `title` (required)
    - `description` (optional)
    - `type` (`DOCUMENT` or `VIDEO`, required)
    - `department` (optional, but strongly recommended for academic content)
    - `category` (optional: `Spiritual|Personal|Career`)
    - `level` (optional but validated against department rules)
    - `file` (required for `DOCUMENT` uploads)
    - `videoUrl` (optional for `VIDEO` when using external hosting)

- **Validation rules** (same as current implementation):
  - If `level === "Level 600"` → `department` must be Pharmacy.
  - If `level === "Level 500"` → `department` must be Pharmacy or Architecture.

- **Behavior**
  - If `type === "DOCUMENT"`, expect `file` and store it; generate file URL.
  - If `type === "VIDEO"`, use `videoUrl` or optionally accept a file.
  - Create `Resource` row.

- **Response (201)**
  ```json
  {
    "id": "new-resource-id",
    "title": "New Notes",
    "type": "DOCUMENT",
    "url": "/uploads/new-notes.pdf",
    "department": "Pharmacy",
    "level": "Level 500",
    "category": "Career",
    "downloads": 0,
    "createdAt": "2026-02-20T00:00:00.000Z"
  }
  ```

### 5.4 Increment download count

#### POST `/api/v1/resources/:id/download`

- Used when the frontend triggers a download/view.
- **Behavior**:
  - Increments `downloads` for that resource.
  - Optionally returns a signed URL or direct URL for the file.

- **Response (200)**
  ```json
  { "url": "/uploads/new-notes.pdf" }
  ```

---

## 6. Departments & Growth Metadata

To keep the frontend thin, these can be provided by the API instead of hard-coded.

### 6.1 Departments

#### GET `/api/v1/departments`

- Returns the list of department names (matches `DEPARTMENTS` constant today).

#### GET `/api/v1/departments/:slug`

- Returns details:
  - `id`, `name`, and optional metadata (courses, descriptions) used in `DepartmentContent`.

### 6.2 Growth Categories

#### GET `/api/v1/growth-categories`

- Returns `Spiritual`, `Personal`, `Career`, etc. with display metadata.

---

## 7. Error Handling & Response Shapes

- Standard JSON error format:

  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Level 600 is only available for Pharmacy.",
      "details": { "field": "level" }
    }
  }
  ```

- Typical HTTP status codes:
  - 200/201 for success.
  - 400 for validation errors.
  - 401 for authentication errors.
  - 403 for authorization failures (e.g., student trying to upload).
  - 404 for not found.
  - 500 for unexpected server errors.

---

## 8. Versioning Strategy

- All endpoints are namespaced under `/api/v1`.
- Breaking changes result in `/api/v2/...` while keeping `/api/v1` stable until the frontend migrates.

---

## 9. Frontend Integration Plan

High-level steps to migrate the existing Next.js frontend to this external API:

1. **Auth integration**
   - Replace direct `authenticate`/NextAuth usage with calls to `/api/v1/auth/login` from the login panels.
   - Store returned token in httpOnly cookie or memory + `Authorization` headers.
   - Replace current middleware-based auth with a combination of frontend guard logic and optionally Next.js route middleware that checks cookies.

2. **Resources fetching**
   - Update:
     - `/departments/[slug]` to call `GET /api/v1/resources?department=...&level=...` instead of using `getResources` server action.
     - `/growth/[category]` to call `GET /api/v1/resources?category=...` for featured resources.
   - Optionally wire the dashboard (`/`) pinned/recent sections to `GET /api/v1/resources` with sorting and limits.

3. **Upload flow**
   - Replace `uploadResource` server action in the frontend with `POST /api/v1/resources` using `fetch` and `FormData`.
   - Pass auth token for contributor uploads.

4. **Downloads**
   - When user clicks "Download" on a `ResourceCard`, call `POST /api/v1/resources/:id/download`, then redirect the browser to the returned `url`.

5. **Metadata**
   - Optionally replace local `DEPARTMENTS` and inline growth definitions with data from `/api/v1/departments` and `/api/v1/growth-categories` to ensure consistency across clients.

---

## 10. Future Extensions

- Add **admin** endpoints for managing users and resources (archiving, approval workflows).
- Add search endpoints (e.g. `GET /api/v1/search?q=...`) that span departments and growth categories.
- Implement rate limiting and API keys if the API becomes public.

