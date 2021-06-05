FROM node:alpine
WORKDIR /bmi
#copy all the files in the bmi folder
COPY . .
# expose port
EXPOSE 3000
#expose mongodb port
EXPOSE 27017

# execute start the node process
CMD ["npm","run","start"]





#list images
#sudo docker image ls


#build command
#sudo docker build -t z1 .

#sudo docker image tag ecf amaanpatel56/zeusv1:3

#push images to docker hub
#sudo docker push amaanpatel56/zeusv1:2

#run with open port number
#sudo docker run -d -p 8087:8087 z1

#removes dangling images
#sudo docker image prune


#remove stop images
#sudo docker container prune

#remove imags
#sudo docker image rm zeusv1

#stop container
#sudo docker stop imageid

#show running process
#sudo docker ps

