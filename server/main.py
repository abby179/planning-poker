from typing import Optional, List, Iterable

from fastapi import FastAPI
from uuid import uuid4

import models

app = FastAPI()


@app.get("/api")
def read_root():
    return {"Hello": "World"}


@app.post("/api/auth/anonymous/login")
def create_anonymous_user(anonymous_user_config: models.UserCreateModel) -> models.UserModel:
    new_anonymous_user = models.UserModel(
        id=uuid4().hex,
        **anonymous_user_config.dict()
    )

    models.DBUserModel.get_or_create(
        new_anonymous_user
    )
    return new_anonymous_user


@app.get("/api/users")
def list_users() -> Iterable[models.UserModel]:
    return models.DBUserModel.get_all()


@app.delete("/api/user")
def delete_user(id: str):
    return models.DBUserModel.delete(id)


@app.post("/api/poll")
def create_poll(poll_config: models.PollCreateModel) -> models.PollModel:
    new_poll = models.PollModel(
        id=uuid4().hex,
        **poll_config.dict()
    )

    models.DBPollModel.get_or_create(
        new_poll
    )
    return new_poll


@app.get("/api/polls")
def list_polls() -> Iterable[models.PollModel]:
    return models.DBPollModel.get_all()


@app.get("/api/poll")
def get_poll() -> models.PollModel:
    return models.DBPollModel.get('12e67ae3e07d4f6281f670cb17d8de57')


@app.delete("/api/poll")
def delete_poll(id: str):
    return models.DBPollModel.delete(id)
