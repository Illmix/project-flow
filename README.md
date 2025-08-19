# ProjectFlow

![GitHub License](https://img.shields.io/github/license/Illmix/project-flow)
![GitHub Repo stars](https://img.shields.io/github/stars/Illmix/project-flow?style=social)

**Agile Resource Management Hub.**
### About the project

**ProjectFlow** is a pet project created to solve a common problem in team management: how to effectively assign tasks based on employee skills and current workload.

### Tech Stack

**Frontend:**
* React
* Apollo Client (for GraphQL)
* React DND Kit (for Drag-and-Drop)
* TailwindCSS

**Backend:**
* Node.js
* Prisma (ORM)
* Apollo Server (GraphQL API)
* PostgreSQL (Database)
* DataLoader (to solve the N+1 problem)

**DevOps & Tools:**
* Docker
* ESLint / Prettier
* Jest
---

### Running Locally

**Prerequisites:**
* Node.js (v18.x or higher)
* Docker and Docker Compose

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Illmix/project-flow.git
    cd project-flow
    ```

2.  **Set up and run Docker:**
    * In the root directory, create a `.env` file by copying the contents of `.env.example`. This file contains the variables for the database.
    * Start the database containers using Docker Compose.
    ```bash
    cp .env.example .env
    docker-compose up -d
    ```

3.  **Configure and run the Backend:**
    * Navigate to the backend directory.
    * Create `.env` and `.env.test` files from their respective examples.
    * Install dependencies, run the database migration, generate types, run tests, and start the server.
    ```bash
    cd backend
    cp .env.example .env
    cp .env.test.example .env.test
    npm install
    npx prisma migrate dev
    npx dotenv -e .env.test -- npx prisma migrate deploy
    npm run codegen
    npm test
    npm run dev
    ```

4.  **Configure and run the Frontend:**
    * Navigate to the frontend directory from the root.
    * Create a `.env` file from the example.
    * Install dependencies, generate types, and start the development server.
    ```bash
    cd ../frontend
    cp .env.example .env
    npm install
    npm run codegen
    npm run dev
    ```

5.  **Access the application:**
    * The application will be available at `http://localhost:5173`.
    * The GraphQL Playground will be available at `http://localhost:5000/graphql`.

---
