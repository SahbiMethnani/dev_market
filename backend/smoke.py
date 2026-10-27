import os
os.environ["DATABASE_URL"] = "sqlite:///./smoke.db"
from fastapi.testclient import TestClient
from app.main import app
from PIL import Image
from io import BytesIO

img = BytesIO()
Image.new("RGB", (100, 100), "blue").save(img, format="PNG")
img.seek(0)
c = TestClient(app)
r = c.post("/auth/register", json={"username":"Dev One","email":"d@x.com","password":"secret1","role":"developer"}); print(r.status_code)
r = c.post("/auth/register", json={"username":"Client One","email":"c@x.com","password":"secret1","role":"client"}); print(r.status_code)
td = c.post("/auth/login", json={"email":"d@x.com","password":"secret1"}).json()["access_token"]
tc = c.post("/auth/login", json={"email":"c@x.com","password":"secret1"}).json()["access_token"]
H = lambda t: {"Authorization": f"Bearer {t}"}
r = c.post(
    "/projects",
    data={
        "title": "Mon projet",
        "price": "150.5",
        "description": "Une belle description de test",
        "url": ""
    },
    files={
        "screenshot": ("a.png", img, "image/png")
    },
    headers=H(td)
)

print(r.status_code, r.text)
pid = r.json()["id"]
print(c.post("/projects", data={"title":"X1","price":"1","description":"description longue"}, headers=H(tc)).status_code)
print(len(c.get("/projects?q=belle").json()))
conv = c.post("/conversations", json={"project_id":pid}, headers=H(tc)); print(conv.status_code, conv.json())
cid = conv.json()["id"]
print(c.post(f"/conversations/{cid}/messages", json={"content":"Bonjour, 100 DT ?"}, headers=H(tc)).status_code)
print(c.post(f"/conversations/{cid}/messages", json={"content":"Ok 130"}, headers=H(td)).status_code)
print(len(c.get(f"/conversations/{cid}/messages", headers=H(td)).json()), c.get("/conversations", headers=H(td)).json())
print(c.put(f"/projects/{pid}", data={"title":"Nouveau nom","price":"99","description":"Description modifiée","url":"https://a.b"}, headers=H(td)).json()["title"])
print(c.delete(f"/projects/{pid}", headers=H(td)).status_code)
