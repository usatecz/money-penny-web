import logging

from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel

from app.config import settings

logger = logging.getLogger(__name__)


class GoogleUser(BaseModel):
    sub: str
    email: str
    name: str
    picture: str


class GoogleAuthError(Exception):
    pass


def verify_google_id_token(token: str) -> GoogleUser:
    if not settings.google_client_id:
        raise GoogleAuthError("GOOGLE_CLIENT_ID is not configured")

    try:
        payload = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.google_client_id,
        )
    except ValueError as exc:
        logger.warning("Google ID token verification failed: %s", exc)
        raise GoogleAuthError("Invalid Google ID token") from exc

    sub = payload.get("sub")
    email = payload.get("email")
    name = payload.get("name")
    picture = payload.get("picture")

    if not sub or not email or not name:
        raise GoogleAuthError("Google ID token is missing required claims")

    return GoogleUser(
        sub=sub,
        email=email,
        name=name,
        picture=picture or "",
    )
