FROM python:3.7-slim

ENV CONTAINER_HOME=/var/www
WORKDIR $CONTAINER_HOME

ADD requirements.txt .

# keep the parent server directory structure for relative imports
RUN mkdir server
ADD server $CONTAINER_HOME/server

RUN apt-get update && apt-get upgrade -y
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install --no-cache-dir -r requirements.txt
# OpenCV
RUN apt-get install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxrender1 libxext6
RUN pip install opencv-python
RUN pip install opencv-contrib-python
