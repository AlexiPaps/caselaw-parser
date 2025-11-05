## ⚙️ Setup Instructions

Follow these steps to run the project locally and test the full workflow.

### 🧱 Prerequisites

Make sure you have the following installed:

* **Node.js** (v18 or higher)
* **Docker & Docker Compose**
* **Git**
* **OpenAI API Key**

---

### 🚀 1. Clone the Repository and Install Dependencies

```bash
git clone https://github.com/AlexiPaps/caselaw-parser.git
cd caselaw-parser
npm install
```

---

### 🐳 2. Start the PostgreSQL Database

Use Docker to spin up a local Postgres container:

```bash
docker compose up -d
```

This will run the database defined in the `docker-compose.yml`.

---

### ⚙️ 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caselaw_db?schema=public"
OPENAI_API_KEY="your-openai-api-key"
PORT=3000
```
---

### 🗃️ 4. Run Prisma Migrations

```bash
npx prisma migrate dev
```

This ensures your local database matches the schema.

---

### 🧠 5. Start the NestJS GraphQL Server

```bash
npm run start:dev
```

Once running, open:

> [http://localhost:3000/graphql](http://localhost:3000/graphql)

To upload files to the server you can either use this simple frontend:

```bash
git clone https://github.com/AlexiPaps/caselaw-upload.git
cd caselaw-upload
npm install
npm run dev
``` 

Once running, open:

> [http://localhost:5173](http://localhost:5173)

Or use some other API Client e.g. Postman.

You can now upload `.pdf` or `.html` files, and the backend will process them with the AI service.

---

### 🧾 6. Testing the AI Processing

After uploading a file, the service:

1. Parses and splits the document into chunks.
2. Sends chunks to the **OpenAI API**.
3. Extracts structured metadata like `title`, `court`, `dateOfDecision` and `summary`.

You can verify the results directly through the GraphQL Playground.

---

## ⚖️ Design Decisions and Trade-offs

Throughout development, several design choices were made to balance simplicity and scalability:

- NestJS + GraphQL – Chosen for its modular architecture and strong typing.

- Prisma ORM – Type-safe interface to the database. The trade-off is slower startup and migration overhead compared to raw SQL.

- Separate Base, Model, and DTO classes – Adds some duplication but improves maintainability, validation, and future extensibility (e.g., partial updates or admin-specific DTOs).

- Text extraction of the documents rather than sending the actual files to the AI API.

- Chunk-based AI Processing – Enables handling long documents within model limits but increases processing time and potential token costs.

---

## 🧩 Data Schema Structure & Management

This project uses a **layered schema design** that integrates **Prisma**, **GraphQL**, and **NestJS DTOs** to maintain clean boundaries between database, API input, and API output.

### Overview

The data flow for a `CaseLaw` entity moves through several layers:

```
Client → GraphQL DTO → Service → Prisma Model → Database
```

Each layer has a distinct responsibility:

| Layer | File Example | Description |
|-------|---------------|-------------|
| **Prisma Model** | `prisma/schema.prisma` | Defines the actual database schema and migrations. |
| **GraphQL Base Model** | `caselaw/caselaw.base.ts` | Defines common GraphQL fields and validation rules. Used by both inputs and outputs. |
| **GraphQL Input DTO** | `caselaw/dto/create-caselaw.input.ts` | Defines what the API accepts as input (e.g., when creating or updating records). |
| **GraphQL Object Model** | `caselaw/caselaw.model.ts` | Defines what the API returns to clients (the response type). |

---

## 🛡️ Considerations Before Production

Key considerations before going to production:
- Apply rate limiting to prevent abuse.
- Authentication and authorization to protect endpoints.
- Store uploaded files in dedicated storage rather than local folder.
- Add OCR for pdf files that are not text based.
- Add retry logic and error handling for AI API requests.  
- Implement caching for identical or repeated requests.  
- Version prompts to ensure reproducibility of AI-driven extraction.
- Configure regular backups.  
- Add better error handling and logging.
- Collect metrics for upload success/failure, AI latency and DB query performance.
- Add unit tests, simulations for uploads and GraphQL mutations and automated test of the complete flow: Upload → AI → Database.
- Caching repeated AI results

---