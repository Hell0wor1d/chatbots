##Inroduction

###Backgroud
This is a ChatBots prototype, which can provide Self-Service to help learners get the course plan.
If any questions, you can touch me. root#kev7n.com, pls replace # to @

###Tech Stack

DEVELOPMENT STACK|Tool
---|---|
Server OS|CENTOS 7.2 / Ubuntu|
Containerization / Scale Down Deployments|Docker|
Transport Protocol|REST via HTTPS|
Backend Language| Python |
Python API Framework|Flask / Flask_restful|
Frontend Language| Javascript / html / css |
Client RIA Framework|Angular.js|
Frontend Development|Pug / less / gulp|
HTTP Server|Nginx / uwsgi|


##Playground

###How To Deployment

####Docker
```
docker build -t docker-chatbots .
```
```
docker run -d --name bots -p 0.0.0.0:8080:80 docker-chatbots
```
```
docker exec -i -t bots /bin/bash
```


uwsgi --http-socket :9090 --plugin python --wsgi-file wsgi.py --callable app


###How To Development and Debugging

####Generate assets

In this project, less and pug were used to generate css and html. if any changes, the assets needs to be synced to app assets folder.

go to src/frontend folder to execute gulp will automatically generate the assets and watch the file changing.

