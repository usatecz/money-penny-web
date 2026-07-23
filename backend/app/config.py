from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    google_client_id: str = ""
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    cors_permissive_dev: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def cors_origin_regex(self) -> str | None:
        if self.cors_permissive_dev:
            return r"https?://.*"
        return None


settings = Settings()
