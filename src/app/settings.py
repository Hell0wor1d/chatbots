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

import logging, os
from datetime import timedelta

# base config class; extend it to your needs.
class Config(object):
    ENV = "prod"

    # use DEBUG mode?
    DEBUG = False

    # use TESTING mode?
    TESTING = False

    # use server x-sendfile?
    USE_X_SENDFILE = False

    WTF_CSRF_ENABLED = True

    SESSION_TYPE = 'filesystem'

    SECRET_KEY = os.urandom(24) #os.environ['FLASK_SECRET_KEY']

    # LOGGING
    LOGGER_NAME = "app_log" 
    LOG_FILENAME = "/var/log/flask/flask.log"
    LOG_LEVEL = logging.INFO
    LOG_FORMAT = "%(asctime)s %(levelname)s\t: %(message)s" # used by logging.Formatter

    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

# config class for development environment
class DevConfig(Config):
    ENV = "dev"
    DEBUG = True  # we want debug level output


class BotsConfig():
    # set chatBots name
    NAME = "WSE ChatBots"

    # bots questions
    QUESTION = {
        0: 'Describe your goals for learning English?',
        1: 'How many hours per week can you commit to studying English?',
        2: 'What are some of the challenges that you have faced in learning English?',
    }

    CONVERSATION = [
        "Hello",
        "Hi there!",
        "How are you doing?",
        "I'm doing great.",
        "That is good to hear",
        "Thank you.",
        "You're welcome.",
        "What is your name?",
        "My name is Kev7n!",
        "Wall Street English",
        "Wall Street English is a local company and a global company. We have over 425 learning centers in 28 countries around the world with a current enrollment of ...",
        "what is WSE?"
    ]

    WELCOME = 'Dear, welcome to Wall Street English Online! If any questions, please feel free to ask me.<p>You can type 1 to get a personalized course plan!</p>'

    ERROR = 'Sorry, I do not understand.'

# config class used during tests
class Test(Config):
    TESTING = True
