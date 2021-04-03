import json
from typing import Optional, List, Iterable, Dict

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from uuid import uuid4

import models
from processer import process_message

app = FastAPI()


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@app.post("/api/auth/anonymous/login")
def create_anonymous_user(anonymous_user_config: models.UserBaseModel) -> models.UserModel:
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


@app.delete("/api/user/{user_id}")
def delete_user(user_id: str):
    return models.DBUserModel.delete(user_id)


@app.post("/api/poll")
def create_poll(poll_config: models.PollCreateModel) -> models.PollModel:
    created_user = models.DBUserModel.get_by_user_name(poll_config.created_by)
    new_poll = models.PollModel(
        id=uuid4().hex,
        title=poll_config.title,
        created_by=created_user,
    )

    models.DBPollModel.get_or_create(
        new_poll
    )
    return new_poll


@app.get("/api/polls")
def list_polls() -> Iterable[models.PollModel]:
    return models.DBPollModel.get_all()


@app.get("/api/poll/{poll_id}")
def get_poll(poll_id: str) -> models.PollModel:
    poll = models.DBPollModel.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Story not found")
    return poll


@app.delete("/api/poll/{poll_id}")
def delete_poll(poll_id: str):
    return models.DBPollModel.delete(poll_id)


@app.websocket("/ws")
async def ws_poll(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            data_dict = json.loads(data)
            payload = json.dumps(process_message(data_dict))
            await manager.broadcast(payload)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
