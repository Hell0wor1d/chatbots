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

'''Public section, including homepage and signup.'''
from flask import (Blueprint, session, request, render_template, make_response)
import uuid
from settings import BotsConfig

blueprint = Blueprint('public', __name__, static_folder="../static")
# home page
@blueprint.route('/')
def basic_pages(**kwargs):
    sid = session.get('sid')
    if sid is None:
        session['sid'] = str(uuid.uuid1())
        session['mode'] = 'NORMAL'

        session['q_list'] = BotsConfig.QUESTION

    resp = make_response(render_template("index.html"))
    return resp