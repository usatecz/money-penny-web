from typing import Literal

from pydantic import BaseModel

SubscriptionPlan = Literal["basic", "premium"]


class UserSettings(BaseModel):
    subscriptionPlan: SubscriptionPlan = "basic"


class UserSettingsUpdate(BaseModel):
    subscriptionPlan: SubscriptionPlan
