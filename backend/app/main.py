from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health, profile, settings as settings_router, sync, tasks

app = FastAPI(
    title="Money Penny API",
    version="0.1.0",
    description="Sync API for Money Penny user profile, tasks, and settings.",
)

cors_kwargs: dict = {
    "allow_origins": settings.cors_origin_list,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if settings.cors_origin_regex:
    cors_kwargs["allow_origin_regex"] = settings.cors_origin_regex

app.add_middleware(CORSMiddleware, **cors_kwargs)

app.include_router(health.router)
app.include_router(profile.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(settings_router.router, prefix="/api")
app.include_router(sync.router, prefix="/api")
