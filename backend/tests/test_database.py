from app.database import DATABASE_URL, _normalize_database_url


def test_mysql_connection_string_uses_pymysql():
    connection_url = "mysql://db.example.invalid:4000/devmarket"
    assert _normalize_database_url(connection_url) == (
        "mysql+pymysql://db.example.invalid:4000/devmarket"
    )


def test_existing_pymysql_url_is_unchanged():
    connection_url = "mysql+pymysql://db.example.invalid:4000/devmarket"
    assert _normalize_database_url(connection_url) == connection_url


def test_test_database_uses_sqlite():
    assert DATABASE_URL == "sqlite:///:memory:"
