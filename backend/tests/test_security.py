from app.security import create_access_token, decode_token, hash_password, verify_password


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
