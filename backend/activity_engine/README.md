# Full Installation Guide
This is the activity engine developed in Node.js using TypeScript. We are using Prisma for interaction between the backend and the database.
Follow these steps to set up and run the project:

## Setup Instructions

1. Install dependencies:
    ```bash
    npm install
    ```
2. Setup environment variables:
    ```bash
    cp .env.example .env
    ```
3. Build the project:
    ```bash
    npm run build
    ```
4. Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
    (If an error occurs, ensure your Prisma configuration is correct)
5. Start the development server:
    ```bash
    npm run dev
    ```

### Database Configuration

To set up your database in this application, you need to create a `.env` file in the root directory of your project. In this file, define the `DATABASE_URL` with your PostgreSQL database URL:

```
DATABASE_URL="your_postgres_database_url"
```

### Google Authentication

To implement Google authentication, follow these steps:

1. Create a credentials file in JSON format (e.g., `file.json`) containing all your Google Auth Firebase Admin credentials.
2. Add the path to your credentials file in the `.env` file:

```
FIREBASE_ADMIN_SDK_PATH=path_to_your_credentials_file.json
```

## Folder Structure

```
activity_engine
|- src
   |- config (configured to log various levels of information )
|  |- controller (contains different controllers for each API call functionality)
|  |- middleware (contains Google authentication middleware responsible for verifying users)
|  |- routes (contains various route files for backend API endpoints)
|  |- repositories (stores all repository files for database interactions)
|  |- services (includes business logic services for each functionality,like course Progress)
|  |- types (defines TypeScript types for various elements)
|  |- constant.ts (stores the URL of the LM engine)
|  |- server.ts (configures and initializes the Express server)
|- prisma
|  |- migrations (contains all migrations)
|  |- schema.prisma (contains the Prisma schema or database schema for data storage)
```