from operator import attrgetter, itemgetter
from enum import Enum

from google.cloud.datastore import Entity
from google.cloud import datastore
from pydantic import BaseModel as PydanticBaseModel, Field
from typing import Generic, TypeVar, Type, Tuple, Collection, Optional, Iterable, Any, List, Set

T = TypeVar('T', bound=PydanticBaseModel)


class DBModel(Generic[T]):
    pydantic_model: Type[T]
    entity_kind: str
    id_field: str  # Supports nesting, e.g. "field.subfield"

    # fields that dont need to be indexed (e.g. encrypted data)
    exclude_from_indexes: Tuple[str, ...] = ()

    client = datastore.Client()

    @classmethod
    def write_from_data(cls, data: T) -> Entity:
        key = cls.client.key(cls.entity_kind, attrgetter(cls.id_field)(data))
        entity = datastore.Entity(key=key, exclude_from_indexes=cls.exclude_from_indexes)
        entity.update(data.dict())
        cls.client.put(entity=entity)

        return entity

    @classmethod
    def write_fields(cls, obj: T, fields: Collection[str]) -> Optional[T]:
        """Writes only the specified `fields` from `obj` (ignores the other fields and keeps the database values).

        Returns None if didn't exist. Otherwise, returns the written object,
        which might have different field values than `obj`.
        """
        if not fields:
            raise ValueError("Empty fields list.")

        with cls.client.transaction():
            db_obj = cls.get(attrgetter(cls.id_field)(obj))

            if db_obj is not None:
                items = itemgetter(*fields)(obj.dict())

                if len(fields) == 1:
                    items = (items,)

                values = dict(zip(
                    fields, items
                ))

                updated = cls.pydantic_model(**{**db_obj.dict(), **values})
                cls.write_from_data(
                    updated
                )
                return updated
            else:
                return None

    @classmethod
    def get_all(cls, filters: Tuple[Tuple[str, str, Any], ...] = None) -> Iterable[T]:
        if filters is None:
            filters = []

        query = cls.client.query(kind=cls.entity_kind)

        for filter_ in filters:
            query.add_filter(*filter_)

        yield from map(lambda x: cls.pydantic_model(**x), query.fetch())

    @classmethod
    def get(cls, entity_id) -> Optional[T]:
        key = cls.client.key(cls.entity_kind, entity_id)
        entity = cls.client.get(key=key)

        if entity is None:
            return None

        obj = cls.pydantic_model(**entity)

        return obj

    @classmethod
    def get_or_create(cls, data: T) -> Optional[T]:
        """Returns None if didn't exist. Otherwise, returns the existing values.
        """
        with cls.client.transaction():
            obj = cls.get(attrgetter(cls.id_field)(data))

            if obj is None:
                cls.write_from_data(data)
                return None
            else:
                return obj

    @classmethod
    def delete(cls, entity_id):
        key = cls.client.key(cls.entity_kind, entity_id)
        entity = cls.client.get(key=key)

        if entity is None:
            raise ValueError("Entity doesn't exist")

        cls.client.delete(entity.key)


class UserBaseModel(PydanticBaseModel):
    user_name: str


class UserModel(UserBaseModel):
    id: str


class VoteOptions(str, Enum):
    sp_0 = "sp_0"
    sp_0_5 = "sp_0_5"
    sp_1 = "sp_1"
    sp_2 = "sp_2"
    sp_3 = "sp_3"
    sp_5 = "sp_5"
    sp_8 = "sp_8"
    sp_13 = "sp_13"


class VoteBaseModel(PydanticBaseModel):
    user: UserModel
    type: VoteOptions


class PollCreateModel(PydanticBaseModel):
    title: str
    created_by: str


class PollModel(PydanticBaseModel):
    id: str
    title: str
    created_by: UserModel
    votes: List[VoteBaseModel] = []


class MessageRoutes(str, Enum):
    vote = "poll/vote"
    withdraw = "poll/withdraw"


class MessageModel(PydanticBaseModel):
    route: str
    user_name: str
    poll_id: str
    type: Optional[str]


class DBUserModel(DBModel[UserModel]):
    pydantic_model = UserModel
    entity_kind = "user"
    id_field = "id"

    @classmethod
    def get_by_user_name(cls, user_name: str):
        return next(cls.get_all(
            (
                ("user_name", "=", user_name),
            )
        ), None)


class DBPollModel(DBModel[PollModel]):
    pydantic_model = PollModel
    entity_kind = "poll"
    id_field = "id"
