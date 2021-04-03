from typing import List, Dict

import models


def process_message(data: models.MessageModel):
    route = data["route"]
    user = models.DBUserModel.get_by_user_name(data["user_name"])
    poll = models.DBPollModel.get(data["poll_id"])

    if route == models.MessageRoutes.vote:
        new_vote = models.VoteBaseModel(
            user=user,
            type=data["type"]
        )
        poll.votes.append(new_vote)
        return models.DBPollModel.write_fields(poll, ("votes",)).dict()

    if route == models.MessageRoutes.withdraw:
        poll.votes = [vote for vote in poll.votes if vote.user != user]
        return models.DBPollModel.write_fields(poll, ("votes",)).dict()

