# News Central

News Central is a news aggregator application that fetches articles from various sources and displays them in a unified interface.

## Project Structure

-   `backend/`: A Laravel application that serves as the API and news aggregation engine.
-   `spa/`: A Single Page Application (frontend) for displaying the news.

## Getting Started

### Prerequisites

-   Docker
-   Docker Compose

### Setup

1.  **Clone the repository.**

2.  **Create Environment Files:**

    This project uses `.env.development` files for local development. You should copy the example environment files if they are not already present. For the backend, there is an `.env.example` file.

    ```bash
    cp backend/.env.example backend/.env.development
    ```
    You will also need to create a `.env.development` for the `spa` if it's not there. Make sure the environment variables in these files are configured correctly, especially the database credentials and API keys for the news sources.

3.  **Build and Run the Application:**

    Use Docker Compose to build and run all the services in detached mode:

    ```bash
    docker-compose up -d --build
    ```

    This command will start the following services:
    -   `backend`: The Laravel application.
    -   `queue`: A dedicated container for running Laravel's queue worker.
    -   `scheduler`: A container that runs the Laravel scheduler every minute.
    -   `postgres`: The PostgreSQL database.
    -   `redis`: A Redis server for caching and queueing.
    -   `spa`: The frontend application.

## Services

-   **Backend API:** Available at `http://localhost:6225`
-   **Frontend SPA:** Available at `http://localhost:6226`
-   **PostgreSQL Database:** Available at `localhost:6224`

## Development

### Running Artisan Commands

To run any `php artisan` command, you need to execute it inside the `backend` container. You can do this with `docker-compose exec`:

```bash
docker-compose exec backend php artisan <your-command>
```

For example, to see the list of routes:

```bash
docker-compose exec backend php artisan route:list
```

### Automated News Ingestion Flow

The application is designed to fetch news automatically. This process involves three key components: the **Scheduler**, the **Backend Application**, and the **Queue Worker**.

1.  **Scheduler (`scheduler` container):**
    -   A simple cron-like process that runs every minute.
    -   Its only job is to trigger Laravel's built-in scheduler by running `php artisan schedule:run`.

2.  **Scheduled Task (`backend` container):**
    -   The Laravel scheduler is configured in `backend/routes/console.php` to run the `news:ingest` command every ten minutes.
    -   When triggered, this command's only responsibility is to dispatch the `IngestFromSourceJob` jobs to the queue. It does **not** fetch any news itself.

3.  **Queue & Worker (`redis` and `queue` containers):**
    -   The dispatched jobs are pushed onto a list in the **Redis** container.
    -   The **`queue`** container runs a dedicated queue worker process. This worker is constantly listening to Redis for new jobs.
    -   As soon as a job appears, the worker picks it up and executes it, fetching and storing the news articles from the external APIs.

This entire flow can be visualized as:

```
+-----------+   every 10 mins   +-----------------+   pushes jobs   +-------+   pulls jobs   +--------------+
| Scheduler |------------------>| `news:ingest`   |---------------->| Redis |--------------->| Queue Worker |
+-----------+                   +-----------------+                 +-------+                +--------------+
  (triggers)                      (dispatches)                      (queues)                   (processes)
```

This architecture ensures a clear separation of concerns and makes the system robust and scalable.

If you want to trigger the news ingestion manually, you can run the `news:ingest` command:

```bash
docker-compose exec backend php artisan news:ingest
```

This will dispatch the jobs to the queue, and the `queue` container will process them, just as if the scheduler had run it.
