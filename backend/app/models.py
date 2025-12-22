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
    status: str = "Open"
    is_archived: bool = False
    created_at: datetime = Field(
        sa_column_kwargs={"server_default": func.now()})
