import asyncio
from io import BytesIO

import pytest
from fastapi import HTTPException, UploadFile
from starlette.datastructures import Headers

from app.security import create_access_token, decode_token, hash_password, verify_password
from app.routers.projects import MAX_SIZE, save_screenshot


def test_hash_and_verify_password():
    hashed = hash_password("secret123")
    assert hashed != "secret123"
    assert verify_password("secret123", hashed)
    assert not verify_password("wrong", hashed)


def test_access_token_roundtrip():
    token = create_access_token(42)
    assert decode_token(token) == 42


def test_decode_invalid_token():
    assert decode_token("not-a-valid-token") is None


def test_screenshot_upload_rejects_more_than_five_megabytes():
    file = UploadFile(
        filename="large.png",
        file=BytesIO(b"\x89PNG\r\n\x1a\n" + b"x" * MAX_SIZE),
        headers=Headers({"content-type": "image/png"}),
    )

    with pytest.raises(HTTPException) as error:
        asyncio.run(save_screenshot(file))

    assert error.value.status_code == 413
