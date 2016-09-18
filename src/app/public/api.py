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

        if mode is None or question == '1':
            mode = Mode.Normal
        elif question == '2':
            mode = Mode.Planning
            session['q_list'] = {}
        session['mode'] = mode
        if question == '[hi]':
            resp_message = self.bots_settings.WELCOME
            return { 'message' :resp_message , 'mode' : mode}, 201

        if question.strip() == '':
            resp_message = 'Please type something.'
            return {'message': resp_message, 'mode': mode}, 201

        if mode == Mode.Planning:
            q_list = session.get('q_list')
            q_id = 0
            if q_list is None:
                q_list = {}
                session['q_list'] = q_list

            q_list_len = len(q_list)
            if q_list_len > 0:
                q_id = q_list_len
                session['q_list'][qid] = question

            if q_id >= len(self.bots_settings.QUESTION):
                resp_message = 'You have answered all the questions. thank you! Bye!'
                session['mode'] = Mode.Normal
            else:
                resp_message = self.bots_settings.QUESTION[str(q_id)]
            return {'message': resp_message, 'mode': mode, 'qid' : q_id }, 201

        resp_message = self.bots.get_response(question).text
        if resp_message == '':
            resp_message = self.bots_settings.ERROR

        return {'message': resp_message, 'mode': mode}, 201

    def __get_normal(self):
        pass

    def __get_planning(self):
        pass