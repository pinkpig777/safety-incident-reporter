from datetime import datetime, timedelta
import os
import sys

from sqlmodel import Session, SQLModel

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.db import engine
from app.models import Incident


def seed():
    SQLModel.metadata.create_all(engine)

    now = datetime.utcnow()
    seed_data = [
        {
            "location": "Rolling Mill",
            "category": "Mechanical",
            "severity": "High",
            "description": "Conveyor motor overheating; shutdown initiated.",
            "status": "Open",
            "reported_by": "Operator A",
        },
        {
            "location": "Blast Furnace",
            "category": "Chemical",
            "severity": "Medium",
            "description": "Minor gas leak detected near valve assembly.",
            "status": "Investigating",
            "reported_by": "Safety Lead",
        },
        {
            "location": "Scrap Yard",
            "category": "Slip/Trip/Fall",
            "severity": "Low",
            "description": "Oil residue near forklift lane; slip hazard.",
            "status": "Open",
            "reported_by": "Yard Supervisor",
        },
        {
            "location": "Shipping Dock",
            "category": "Mechanical",
            "severity": "Medium",
            "description": "Dock leveler hydraulics sluggish during lift cycle.",
            "status": "Investigating",
            "reported_by": "Dock Foreman",
        },
        {
            "location": "Rolling Mill",
            "category": "Electrical",
            "severity": "High",
            "description": "Panel breaker tripped; arc flash marks observed.",
            "status": "Resolved",
            "reported_by": "Maintenance Tech",
            "resolved_at": now - timedelta(days=2),
        },
        {
            "location": "Blast Furnace",
            "category": "Mechanical",
            "severity": "Medium",
            "description": "Vibration anomaly on blower unit; monitoring required.",
            "status": "Open",
            "reported_by": "Shift Engineer",
        },
        {
            "location": "Shipping Dock",
            "category": "Slip/Trip/Fall",
            "severity": "Low",
            "description": "Loose cable covers in loading bay.",
            "status": "Resolved",
            "reported_by": "Warehouse Lead",
            "resolved_at": now - timedelta(days=1),
        },
        {
            "location": "Scrap Yard",
            "category": "Chemical",
            "severity": "High",
            "description": "Unknown drum leak; hazmat team notified.",
            "status": "Investigating",
            "reported_by": "Hazmat Coordinator",
        },
        {
            "location": "Rolling Mill",
            "category": "Mechanical",
            "severity": "Medium",
            "description": "Guard rail loosened near rolling stand.",
            "status": "Open",
            "reported_by": "Line Supervisor",
        },
        {
            "location": "Blast Furnace",
            "category": "Electrical",
            "severity": "Low",
            "description": "Flickering status lights on control panel.",
            "status": "Resolved",
            "reported_by": "Control Room",
            "resolved_at": now - timedelta(days=3),
        },
    ]

    with Session(engine) as session:
        for item in seed_data:
            session.add(Incident(**item))
        session.commit()

    print(f"Seeded {len(seed_data)} incidents.")


if __name__ == "__main__":
    seed()
