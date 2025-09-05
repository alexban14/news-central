# News Central

News Central is a web platform designed to aggregate news from various sources, provide a unified interface for browsing, and allow users to personalize their news feed.

## Features

-   **News Aggregation:** Fetches articles from multiple external news APIs (e.g., New York Times, The Guardian, NewsAPI).
-   **User Authentication:** Secure user registration and login system.
-   **Personalized News Feed:** Authenticated users can customize their news feed by selecting preferred news sources and authors.
-   **Search and Filtering:** Users can search for articles and filter by source, date range, and sort order.
-   **Responsive Design:** Optimized for various screen sizes (desktop, tablet, mobile).

## Architecture

News Central is built as a monorepo, separating the backend API and frontend Single Page Application.

-   **`backend/` (Laravel):**
    *   **Framework:** Laravel (PHP)
    *   **API:** Provides RESTful API endpoints for news articles, sources, user authentication, and user preferences.
    *   **Database ORM:** Eloquent
    *   **Database:** PostgreSQL
    *   **Queue:** Redis for background job processing (news ingestion).
    *   **Scheduler:** Manages automated news ingestion tasks.
    *   **Layered Architecture:** Follows a layered architecture with Controllers, Services, and Repositories to ensure separation of concerns and maintainability (DRY and SOLID principles).

-   **`spa/` (React.js):**
    *   **Framework:** React.js with TypeScript
    *   **State Management:** Redux Toolkit
    *   **Data Fetching:** TanStack Query for efficient data fetching, caching, and synchronization.
    *   **UI Library:** Material-UI (MUI) for a consistent and modern user interface.

## Getting Started

### Prerequisites

-   Docker
-   Docker Compose

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/news-central.git
    cd news-central
    ```

2.  **Create Environment Files:**
    This project uses `.env` files for local development.

    For the root of the project:
    ```
    cp .env.example .env
    ```
    For the backend:
    ```bash
    cp backend/.env.example backend/.env
    ```
    For the SPA:
    ```bash
    touch spa/.env.development
    ```
    
3.  **Build and Run the Application:**
    Use Docker Compose to build and run all the services in detached mode:
    ```bash
    docker-compose up -d --build
    ```

    This command will start the following services:
    -   `backend`: The Laravel application (API).
    -   `queue`: A dedicated container for running Laravel's queue worker.
    -   `scheduler`: A container that runs the Laravel scheduler every minute.
    -   `postgres`: The PostgreSQL database.
    -   `redis`: A Redis server for caching and queueing.
    -   `spa`: The frontend application.

## Running the Project

-   **Backend API:** Available at `http://localhost:6225`
-   **Frontend SPA:** Available at `http://localhost:6226` (Access the application through your browser here)
-   **PostgreSQL Database:** Available at `localhost:6224`

### Running Artisan Commands

To run any `php artisan` command, you need to execute it inside the `backend` container. You can do this with `docker-compose exec`:

```bash
docker-compose exec backend php artisan <your-command>
```

For example, to run database migrations:
```bash
docker-compose exec backend php artisan migrate
```

## News Ingestion

The application is designed to fetch news automatically from configured external sources.

### How it Works:

1.  **Scheduler (`scheduler` container):** Runs `php artisan schedule:run` every minute.
2.  **Scheduled Task (`backend` container):** The Laravel scheduler triggers the `news:ingest` command every ten minutes (configured in `backend/routes/console.php`). This command dispatches `IngestFromSourceJob` jobs to the queue.
3.  **Queue & Worker (`redis` and `queue` containers):** The `IngestFromSourceJob` jobs are pushed to Redis. The `queue` container's worker listens to Redis, picks up these jobs, and executes them. Each job fetches articles from a specific news source API and stores them in the database.

This architecture ensures efficient, asynchronous news fetching without blocking the main application.

### Manual Ingestion:

To trigger news ingestion manually:
```bash
docker-compose exec backend php artisan news:ingest
```

### Checking Logs:

To monitor the backend queue and scheduler processes, you can check their respective Docker container logs:

-   **Backend Queue Worker Logs:**
    ```bash
    docker-compose logs queue
    ```
-   **Backend Scheduler Logs:**
    ```bash
    docker-compose logs scheduler
    ```
-   **Main Backend Application Logs:**
    ```bash
    docker-compose logs backend
    ```

## User Preferences and Authentication

The authentication system allows users to register and log in. Once authenticated, users can personalize their news feed:

-   **Profile Page:** On the user's profile page, there are options to select preferred news sources and authors. These preferences are saved to the database.
-   **News Feed Customization:** On the main news listing page, authenticated users will see a toggle to switch between a "Personalized Feed" and a "General Feed".
    *   **General Feed:** Displays all available news articles (accessible to both authenticated and unauthenticated users).
    *   **Personalized Feed:** Filters news articles based on the user's saved preferred sources and authors.

### API Endpoints Overview:

-   **Public Endpoints:**
    *   `POST /api/v1/register`: Register a new user.
    *   `POST /api/v1/login`: Authenticate a user and receive an access token.
    *   `GET /api/v1/sources`: Retrieve a list of available news sources.
    *   `GET /api/v1/authors`: Retrieve a list of unique authors from ingested articles.
    *   `GET /api/v1/articles/general`: Retrieve a general list of news articles.

-   **Authenticated Endpoints (require Bearer Token in `Authorization` header):**
    *   `POST /api/v1/logout`: Log out the current user.
    *   `GET /api/v1/user`: Get details of the authenticated user.
    *   `GET /api/v1/user/preferences`: Get the authenticated user's saved preferences.
    *   `PUT /api/v1/user/preferences`: Update the authenticated user's preferences.
    *   `GET /api/v1/articles/personalized`: Retrieve a personalized list of news articles based on user preferences.
