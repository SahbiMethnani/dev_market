import ssl

from app.database import DATABASE_URL, _engine_options, _normalize_database_url


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


def test_mysql_ssl_uses_verified_tls_context():
    options = _engine_options(
        "mysql+pymysql://db.example.invalid:4000/devmarket",
        require_ssl=True,
    )

    context = options["connect_args"]["ssl"]
    assert isinstance(context, ssl.SSLContext)
    assert context.verify_mode == ssl.CERT_REQUIRED
    assert context.check_hostname


def test_sqlite_does_not_enable_mysql_ssl():
    options = _engine_options("sqlite:///:memory:", require_ssl=True)
    assert options["connect_args"] == {"check_same_thread": False}
