# -*- coding: utf-8 -*-
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
from flask import session
from flask_restful import reqparse, Resource
from settings import BotsConfig
from chatterbot import ChatBot

class Mode():
    Normal = 'Normal'
    Planning = 'Planning'

# REST Web Service
class Chat(Resource):
    bots_settings = BotsConfig
    bots = ChatBot(bots_settings.NAME)

    def __init__(self):
        print('api init.')

    def post(self):

        parser = reqparse.RequestParser()
        # comes from user's message and qid.
        parser.add_argument('question')
        parser.add_argument('qid')
        args = parser.parse_args()
        question = args['question']
        qid = args['qid']
        mode = session.get('mode')

        if question == '1':
            mode = Mode.Planning
        session['mode'] = mode
        if question == '[hi]':
            resp_message = self.bots_settings.WELCOME
            return { 'message' :resp_message , 'mode' : mode}, 201

        if question.strip() == '':
            resp_message = 'Please type something.'
            return {'message': resp_message, 'mode': mode}, 201

        if mode == Mode.Planning:
            q_list = session.get('q_list')
            if q_list is None or 0 >= len(q_list):
                session['mode'] = Mode.Normal
                resp_message = 'You have answered all the questions. Your personalized course plan will be generated... Bye!'
            else:
                l = len(q_list)
                id = l-1
                resp_message = q_list[id]
                del q_list[id]

                #return {'message': resp_message, 'mode': mode, 'qid' : q_id }, 201
        else:
            resp_message = self.bots.get_response(question).text
        if resp_message == '':
            resp_message = self.bots_settings.ERROR

        return {'message': resp_message, 'mode': mode}, 201

    def __get_normal(self):
        pass

    def __get_planning(self):
        pass