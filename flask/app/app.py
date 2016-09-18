# -*- config:utf-8 -*-
#
#  Author:
#       Kev7n <root@kev7n.com>
#
#  Copyright (c) 2016 kev7n.com
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Lesser General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Lesser General Public License for more details.
#
#  You should have received a copy of the GNU Lesser General Public License
#  along with this program.  If not, see <http:#www.gnu.org/licenses/>.

from flask import Flask
from flask_restful import Api
from settings import Config, BotsConfig
import public
from flask_session import Session
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from chatterbot.trainers import ChatterBotCorpusTrainer


def create_app(config_object=Config):
    '''An application factory, as explained here:
        http:#flask.pocoo.org/docs/patterns/appfactories/

    :param config_object: The configuration object to use.
    '''
    app = Flask(__name__)

    app.config.from_object(config_object)
    app.register_blueprint(public.views.blueprint)

    Session(app)

    api = Api(app)
    # Actually setup the Api resource routing here
    api.add_resource(public.api.Chat, '/chat')

    init_bots(BotsConfig)
    return app


def init_bots(config_object=BotsConfig):
    chatBots = ChatBot(config_object.NAME)

    chatBots.set_trainer(ChatterBotCorpusTrainer)
    # Train based on the english corpus
    chatBots.train("chatterbot.corpus.english")

    # Train based on english greetings corpus
    chatBots.train("chatterbot.corpus.english.greetings")

    # Train based on the english conversations corpus
    chatBots.train("chatterbot.corpus.english.conversations")

    chatBots.set_trainer(ListTrainer)
    chatBots.train(config_object.CONVERSATION)
