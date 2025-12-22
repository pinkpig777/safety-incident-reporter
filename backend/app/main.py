from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import SQLModel, Session, select

from app.db import engine, get_session
from app.models import Incident, IncidentCreate, IncidentRead

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
    incident = Incident.model_validate(payload)
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
