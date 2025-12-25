# Safety Incident Reporter (SIR)

Safety Incident Reporter is an internal web application designed for industrial environments to track safety hazards and near-miss incidents.

The system allows workers or supervisors to report incidents, while operations or safety managers can track status, resolve issues, and archive completed cases.

This project demonstrates a full CRUD workflow backed by a relational database and containerized infrastructure.

## Tech Stack

- **Backend:** FastAPI, SQLModel
- **Database:** PostgreSQL (Dockerized)
- **Infra:** Docker Compose
- **Language:** Python 3.13

## Data Model

An `Incident` represents a reported safety issue.

Core fields:

- `location` (e.g. Rolling Mill, Scrap Yard)
- `category` (Mechanical, Electrical, etc.)
- `severity` (Low / Medium / High)
- `description`
- `status` (Open, Investigating, Resolved)
- `reported_by`
- `photo_url`
- `created_at`, `updated_at`, `resolved_at`
- `is_archived` (soft delete)

## Running the Project Locally

### Start the database

```bash
docker compose up -d db
```

### Start the backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Seed demo data (optional)

```bash
cd backend
uv run python scripts/seed.py
```

Note: This uses the backend `DATABASE_URL` and expects the database to be running. Re-running adds another batch of demo incidents.

### Backend will be available at:

```bash
http://127.0.0.1:8000
```

### API endpoints summary (quick scan)

```
## API Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/health` | Health check |
| POST | `/incidents` | Create a new incident |
| GET | `/incidents` | List incidents |
| PATCH | `/incidents/{id}` | Update incident (e.g. status) |
| DELETE | `/incidents/{id}` | Soft archive incident |
```

## Quick API Test (curl)

### Create an incident

```bash
curl -X POST http://127.0.0.1:8000/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Rolling Mill",
    "category": "Mechanical",
    "severity": "High",
    "description": "Conveyor motor overheating",
    "reported_by": "Operator A"
  }'
```

### List Incidents

```bash
curl http://127.0.0.1:8000/incidents
```

### List Incidents (include archived)

```bash
curl "http://127.0.0.1:8000/incidents?include_archived=true"
```

### Update Incidents

```bash
curl -X PATCH http://127.0.0.1:8000/incidents/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Resolved"}'
```

### Archive (Soft Delete) Incident

```bash
curl -X DELETE http://127.0.0.1:8000/incidents/1
```
