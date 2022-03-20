ColorfulPathology
=================

flask-react-nginx based app using docker-compose

Development
-----------

`docker-compose -f conf/docker-dev.yml up`

I have made this easier by adding a dev script

`./scripts/dev.sh`

*Note that the react development server will compile and refresh on file changes*

Production
----------

`docker-compose -f conf/docker-prod.yml up`

I have made this easier by adding a production script

`./scripts/prod.sh`
