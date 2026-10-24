from pathlib import Path
from typing import List, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..deps import require_developer
from ..models import Project, User
from ..schemas import ProjectOut

router = APIRouter(prefix="/projects", tags=["projects"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_TYPES = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5 Mo


def to_out(p: Project) -> ProjectOut:
    return ProjectOut(
        id=p.id,
        title=p.title,
        price=float(p.price),
        description=p.description,
        url=p.url,
        screenshot=p.screenshot,
        developer_id=p.developer_id,
        developer_username=p.developer.username,
        created_at=p.created_at,
    )


def clean_url(url: Optional[str]) -> Optional[str]:
    url = (url or "").strip()
    if not url:
        return None
    if not url.lower().startswith(("http://", "https://")):
        raise HTTPException(400, "L'URL doit commencer par http:// ou https://")
    return url[:500]


def looks_like_image(data: bytes) -> bool:
    return (
        data.startswith(b"\x89PNG\r\n\x1a\n")
        or data.startswith(b"\xff\xd8\xff")
        or (data[:4] == b"RIFF" and data[8:12] == b"WEBP")
    )


async def save_screenshot(file: UploadFile) -> str:
    ext = ALLOWED_TYPES.get(file.content_type)
    if not ext:
        raise HTTPException(400, "Capture invalide : PNG, JPEG ou WEBP uniquement")
    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(413, "Capture trop lourde (5 Mo maximum)")
    if not looks_like_image(data):
        raise HTTPException(400, "Le fichier n'est pas une image valide")
    name = f"{uuid4().hex}{ext}"
    (UPLOAD_DIR / name).write_bytes(data)
    return f"/uploads/{name}"


def delete_screenshot(path: Optional[str]) -> None:
    if path:
        f = UPLOAD_DIR / Path(path).name
        if f.exists():
            f.unlink()


@router.get("", response_model=List[ProjectOut])
def list_projects(q: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Project).options(joinedload(Project.developer))
    if q:
        like = f"%{q}%"
        query = query.filter(Project.title.like(like) | Project.description.like(like))
    return [to_out(p) for p in query.order_by(Project.created_at.desc()).all()]


@router.get("/mine", response_model=List[ProjectOut])
def my_projects(user: User = Depends(require_developer), db: Session = Depends(get_db)):
    projects = (
        db.query(Project)
        .options(joinedload(Project.developer))
        .filter(Project.developer_id == user.id)
        .order_by(Project.created_at.desc())
        .all()
    )
    return [to_out(p) for p in projects]


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    p = (
        db.query(Project)
        .options(joinedload(Project.developer))
        .filter(Project.id == project_id)
        .first()
    )
    if not p:
        raise HTTPException(404, "Projet introuvable")
    return to_out(p)


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(
    title: str = Form(..., min_length=3, max_length=150),
    price: float = Form(..., gt=0, le=10_000_000),
    description: str = Form(..., min_length=10),
    url: Optional[str] = Form(None),
    screenshot: Optional[UploadFile] = File(None),
    user: User = Depends(require_developer),
    db: Session = Depends(get_db),
):
    shot_path = await save_screenshot(screenshot) if screenshot and screenshot.filename else None
    project = Project(
        title=title.strip(),
        price=price,
        description=description.strip(),
        url=clean_url(url),
        screenshot=shot_path,
        developer_id=user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return to_out(project)


@router.put("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: int,
    title: str = Form(..., min_length=3, max_length=150),
    price: float = Form(..., gt=0, le=10_000_000),
    description: str = Form(..., min_length=10),
    url: Optional[str] = Form(None),
    screenshot: Optional[UploadFile] = File(None),
    remove_screenshot: bool = Form(False),
    user: User = Depends(require_developer),
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Projet introuvable")
    if project.developer_id != user.id:
        raise HTTPException(403, "Ce projet ne vous appartient pas")

    if screenshot and screenshot.filename:
        new_path = await save_screenshot(screenshot)
        delete_screenshot(project.screenshot)
        project.screenshot = new_path
    elif remove_screenshot:
        delete_screenshot(project.screenshot)
        project.screenshot = None

    project.title = title.strip()
    project.price = price
    project.description = description.strip()
    project.url = clean_url(url)
    db.commit()
    db.refresh(project)
    return to_out(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    user: User = Depends(require_developer),
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Projet introuvable")
    if project.developer_id != user.id:
        raise HTTPException(403, "Ce projet ne vous appartient pas")
    delete_screenshot(project.screenshot)
    db.delete(project)
    db.commit()
