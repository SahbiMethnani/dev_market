from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_client
from ..models import Conversation, Message, Project, User
from ..schemas import ConversationCreate, ConversationOut, MessageCreate, MessageOut

router = APIRouter(prefix="/conversations", tags=["messagerie"])


def summarize(conv: Conversation, me: User, db: Session) -> ConversationOut:
    last = (
        db.query(Message)
        .filter(Message.conversation_id == conv.id)
        .order_by(Message.created_at.desc(), Message.id.desc())
        .first()
    )
    unread = (
        db.query(Message)
        .filter(
            Message.conversation_id == conv.id,
            Message.sender_id != me.id,
            Message.is_read.is_(False),
        )
        .count()
    )
    other = conv.developer if me.id == conv.client_id else conv.client
    return ConversationOut(
        id=conv.id,
        project_id=conv.project_id,
        project_title=conv.project.title,
        other_username=other.username,
        last_message=last.content if last else None,
        last_message_at=last.created_at if last else conv.created_at,
        unread=unread,
    )


def get_conversation_or_403(conv_id: int, me: User, db: Session) -> Conversation:
    conv = db.get(Conversation, conv_id)
    if not conv:
        raise HTTPException(404, "Conversation introuvable")
    if me.id not in (conv.client_id, conv.developer_id):
        raise HTTPException(403, "Accès refusé")
    return conv


@router.post("", response_model=ConversationOut)
def start_conversation(
    data: ConversationCreate,
    user: User = Depends(require_client),
    db: Session = Depends(get_db),
):
    """Le client ouvre (ou retrouve) la conversation avec le développeur d'un projet."""
    project = db.get(Project, data.project_id)
    if not project:
        raise HTTPException(404, "Projet introuvable")
    conv = (
        db.query(Conversation)
        .filter(Conversation.project_id == project.id, Conversation.client_id == user.id)
        .first()
    )
    if not conv:
        conv = Conversation(
            project_id=project.id, client_id=user.id, developer_id=project.developer_id
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return summarize(conv, user, db)


@router.get("", response_model=List[ConversationOut])
def list_conversations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convs = (
        db.query(Conversation)
        .filter(or_(Conversation.client_id == user.id, Conversation.developer_id == user.id))
        .all()
    )
    result = [summarize(c, user, db) for c in convs]
    result.sort(key=lambda c: c.last_message_at, reverse=True)
    return result


@router.get("/{conv_id}", response_model=ConversationOut)
def get_conversation(conv_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = get_conversation_or_403(conv_id, user, db)
    return summarize(conv, user, db)


@router.get("/{conv_id}/messages", response_model=List[MessageOut])
def list_messages(conv_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = get_conversation_or_403(conv_id, user, db)
    # Marque comme lus les messages reçus
    db.query(Message).filter(
        Message.conversation_id == conv.id,
        Message.sender_id != user.id,
        Message.is_read.is_(False),
    ).update({"is_read": True})
    db.commit()
    return (
        db.query(Message)
        .filter(Message.conversation_id == conv.id)
        .order_by(Message.created_at, Message.id)
        .all()
    )


@router.post("/{conv_id}/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    conv_id: int,
    data: MessageCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = get_conversation_or_403(conv_id, user, db)
    msg = Message(conversation_id=conv.id, sender_id=user.id, content=data.content.strip())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
