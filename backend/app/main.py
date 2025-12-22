from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import SQLModel, Session, select
from sqlalchemy import func
from app.db import engine, get_session
from app.models import Incident, IncidentCreate, IncidentRead, IncidentPatch

app = FastAPI(title="Safety Incident Reporter API")


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
def patch_incident(
    incident_id: int,
    patch: IncidentPatch,
    session: Session = Depends(get_session),
):
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    data = patch.model_dump(exclude_unset=True)

    # If status is changing, handle resolved_at
    if "status" in data:
        new_status = data["status"]
        incident.status = new_status

        if new_status == "Resolved":
            # Use DB time conceptually; simplest is set on app side later
            # but since you want SQL func, we can use func.now() here:
            incident.resolved_at = session.exec(select(func.now())).one()
        else:
            incident.resolved_at = None

        data.pop("status")

    # Apply the rest (location/category/etc)
    for k, v in data.items():
        setattr(incident, k, v)

    session.add(incident)
    session.commit()
    session.refresh(incident)
    return incident
