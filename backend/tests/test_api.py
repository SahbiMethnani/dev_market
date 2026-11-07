from datetime import datetime, timedelta

from generate_data_test import generate_data
from app.main import purge_expired_messages
from app.models import Conversation, Message, Project, User

data = generate_data()
def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_ping(client):
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register_and_login(client):
    register = client.post(
        "/auth/register",
        json={
            "username": data["username"],
            "email": data["email"],
            "password": data["password"],
            "role": "developer"
        },
    )
    assert register.status_code == 201
    body = register.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["username"] == data["username"]
    assert "access_token" in body

    login = client.post(
        "/auth/login",
        json={"email": data["email"], "password": data["password"]},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == data["email"]


def test_register_duplicate_email(client):
    payload = {
        "username": "user_a",
        "email": data["email"],
        "password": "Secret12!",
        "role": "client",
    }
    assert client.post("/auth/register", json=payload).status_code == 201
    dup = client.post(
        "/auth/register",
        json={**payload, "username": "user_b"},
    )
    assert dup.status_code == 400


def test_register_rejects_weak_password(client):
    for password in ("Aa1!", "password1"):
        response = client.post(
            "/auth/register",
            json={
                "username": f"weak_{len(password)}",
                "email": f"weak{len(password)}@example.com",
                "password": password,
                "role": "client",
            },
        )
        assert response.status_code == 422


def test_project_list_is_paginated(client, db):
    developer = User(
        username="pagination_dev",
        email="pagination@example.com",
        hashed_password="unused",
        role="developer",
    )
    db.add(developer)
    db.flush()
    db.add_all(
        [
            Project(
                title=f"Project {index}",
                price=index,
                description="A project for pagination testing",
                developer_id=developer.id,
            )
            for index in range(3)
        ]
    )
    db.commit()

    response = client.get("/projects?skip=0&limit=2")
    assert response.status_code == 200
    first_page = response.json()
    assert first_page["total"] == 3
    assert first_page["skip"] == 0
    assert first_page["limit"] == 2
    assert len(first_page["items"]) == 2

    second_page = client.get("/projects?skip=2&limit=2").json()
    assert second_page["total"] == 3
    assert second_page["skip"] == 2
    assert len(second_page["items"]) == 1


def test_expired_messages_are_deleted(db):
    developer = User(
        username="cleanup_dev",
        email="cleanup-dev@example.com",
        hashed_password="unused",
        role="developer",
    )
    client_user = User(
        username="cleanup_client",
        email="cleanup-client@example.com",
        hashed_password="unused",
        role="client",
    )
    db.add_all([developer, client_user])
    db.flush()
    project = Project(
        title="Cleanup project",
        price=10,
        description="A project used for cleanup testing",
        developer_id=developer.id,
    )
    db.add(project)
    db.flush()
    conversation = Conversation(
        project_id=project.id,
        client_id=client_user.id,
        developer_id=developer.id,
    )
    db.add(conversation)
    db.flush()
    db.add_all(
        [
            Message(
                conversation_id=conversation.id,
                sender_id=developer.id,
                content="Expired",
                created_at=datetime.now() - timedelta(days=31),
            ),
            Message(
                conversation_id=conversation.id,
                sender_id=client_user.id,
                content="Recent",
                created_at=datetime.now() - timedelta(days=29),
            ),
        ]
    )
    db.commit()

    assert purge_expired_messages() == 1
    db.expire_all()
    assert [message.content for message in db.query(Message).all()] == ["Recent"]
