from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from sqlalchemy import func

from app.db import engine, get_session
from app.models import Incident, IncidentCreate, IncidentRead, IncidentPatch

app = FastAPI(title="Safety Incident Reporter API")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/health")
def health():
    return {"status": "System Online"}


@app.post("/incidents", response_model=IncidentRead)
def create_incident(
    payload: IncidentCreate,
    session: Session = Depends(get_session),
):
    incident = Incident(**payload.model_dump())
    session.add(incident)
    session.commit()
    session.refresh(incident)
    return incident


@app.get("/incidents", response_model=List[IncidentRead])
def list_incidents(
    include_archived: bool = False,
    session: Session = Depends(get_session),
):
    stmt = select(Incident).order_by(Incident.id.desc())
    if not include_archived:
        stmt = stmt.where(Incident.is_archived == False)  # noqa: E712
    return session.exec(stmt).all()


@app.patch("/incidents/{incident_id}", response_model=IncidentRead)
@app.put("/incidents/{incident_id}", response_model=IncidentRead)
def patch_incident(
    incident_id: int,
    patch: IncidentPatch,
    session: Session = Depends(get_session),
):
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    data = patch.model_dump(exclude_unset=True)

    # Handle status + resolved_at together
    if "status" in data:
        new_status = data["status"]
        incident.status = new_status

        if new_status == "Resolved":
            incident.resolved_at = func.now()  # DB timestamp
        else:
            incident.resolved_at = None

        data.pop("status")

    # Apply remaining fields (location, category, etc.)
    for k, v in data.items():
        setattr(incident, k, v)

    session.add(incident)
    session.commit()
    session.refresh(incident)
    return incident


@app.delete("/incidents/{incident_id}", response_model=IncidentRead)
def archive_incident(
    incident_id: int,
    session: Session = Depends(get_session),
):
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident.is_archived = True
    session.add(incident)
    session.commit()
    session.refresh(incident)
    return incident
