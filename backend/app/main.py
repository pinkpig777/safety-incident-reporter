import logging
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel, Session, select
from sqlalchemy import func

from app.db import engine, get_session
from app.models import Incident, IncidentCreate, IncidentRead, IncidentPatch

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("safety_incident_reporter")

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


def error_payload(code: str, message: str, details: Optional[list] = None):
    payload = {"error": {"code": code, "message": message}}
    if details is not None:
        payload["error"]["details"] = details
    return payload


@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content=error_payload("bad_request", "Invalid request", exc.errors()),
    )


@app.exception_handler(HTTPException)
def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 404:
        code = "not_found"
    elif exc.status_code == 400:
        code = "bad_request"
    else:
        code = "http_error"
    message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    return JSONResponse(
        status_code=exc.status_code,
        content=error_payload(code, message),
    )


@app.get("/health")
def health():
    try:
        with Session(engine) as session:
            session.exec(select(func.now())).one()
        return {"status": "ok", "db": "up"}
    except Exception:
        return JSONResponse(
            status_code=503,
            content={"status": "degraded", "db": "down"},
        )


@app.post("/incidents", response_model=IncidentRead)
def create_incident(
    payload: IncidentCreate,
    session: Session = Depends(get_session),
):
    incident = Incident(**payload.model_dump())
    session.add(incident)
    session.commit()
    session.refresh(incident)
    logger.info(
        "incident.create id=%s status=%s location=%s severity=%s",
        incident.id,
        incident.status,
        incident.location,
        incident.severity,
    )
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
    if not data:
        raise HTTPException(status_code=400, detail="No update fields provided")
    updated_fields = list(data.keys())

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
    logger.info(
        "incident.update id=%s fields=%s status=%s",
        incident.id,
        ",".join(updated_fields),
        incident.status,
    )
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
    logger.info("incident.archive id=%s", incident_id)
    return incident
