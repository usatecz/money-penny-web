from pydantic import BaseModel, EmailStr, Field


class Profile(BaseModel):
    name: str = ""
    surname: str = ""
    address: str = ""
    email: EmailStr
    phone: str = ""


class ProfileUpdate(BaseModel):
    name: str = Field(default="", max_length=200)
    surname: str = Field(default="", max_length=200)
    address: str = Field(default="", max_length=500)
    email: EmailStr
    phone: str = Field(default="", max_length=50)
