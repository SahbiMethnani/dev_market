from generate_data_test import generate_data

data = generate_data()
def test_root(client):
    response = client.get("/")
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
        "password": "secret12",
        "role": "client",
    }
    assert client.post("/auth/register", json=payload).status_code == 201
    dup = client.post(
        "/auth/register",
        json={**payload, "username": "user_b"},
    )
    assert dup.status_code == 400
