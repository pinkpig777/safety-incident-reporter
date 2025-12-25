from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import func


class Incident(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    location: str
    category: str
    severity: str
    description: str

    status: str = Field(default="Open")
    reported_by: Optional[str] = Field(default=None)
    photo_url: Optional[str] = Field(default=None)

    is_archived: bool = Field(default=False)

    created_at: Optional[datetime] = Field(
        default=None,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        sa_column_kwargs={
            "server_default": func.now(), "onupdate": func.now()},
    )
    resolved_at: Optional[datetime] = Field(default=None)


class IncidentCreate(SQLModel):
    location: str
    category: str
    severity: str
    description: str
    status: str = "Open"
    reported_by: Optional[str] = None
    photo_url: Optional[str] = None
    # is_archived: bool = False
    # resolved_at: Optional[datetime] = None


class IncidentRead(SQLModel):
    id: int
    location: str
    category: str
    severity: str
    description: str
    status: str
    reported_by: Optional[str] = None
    photo_url: Optional[str] = None
    is_archived: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None


class IncidentPatch(SQLModel):
    location: Optional[str] = None
    category: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    reported_by: Optional[str] = None
    photo_url: Optional[str] = None


class IncidentUpdate(SQLModel):
    status: Optional[str] = None
    is_archived: Optional[bool] = None
