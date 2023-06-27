# Zookeeper test with tiny URL

## Dev setup to test the ID generation and interaction with Zookeeper

At this moment there is no actual database just an in memory stub, so it won't work really. But this is to test the ID generation part.

1. Pull the Official ZooKeeper Docker Image
Pull the latest ZooKeeper image from Docker Hub.

```bash
docker pull zookeeper
```

2. Run the ZooKeeper Docker Container
Start a ZooKeeper container from the pulled image, exposing port 2181.

```bash
docker run --name tiny-url-zookeeper --network=tinyurlnetwork -p 2181:2181 -d zookeeper
```

3. Build the Application Docker Image
Navigate to the directory containing your application's Dockerfile, then build a Docker image for the application.

```bash
docker build -t tiny-url-app .
```

4. Run the Application Docker Containers
Start two containers from your application's Docker image. These will connect to the ZooKeeper server using the container name as the hostname.

```bash
docker run -d --name=app-instance-1 --network=tinyurlnetwork -p 3001:3000 tiny-url-app
docker run -d --name=app-instance-2 --network=tinyurlnetwork -p 3002:3000 tiny-url-app
```

Remember to replace tinyurlnetwork with your Docker network name, tiny-url-zookeeper with your ZooKeeper container name, and tiny-url-app with your application's Docker image name. The -p flag maps the container's port to a port on your host machine, and the -d flag runs the container in detached mode.

5. Accessing the Application
With this setup, you should be able to access the two instances of your application at http://localhost:3001 and http://localhost:3002.

6. Stopping and Removing Containers
To stop and remove the containers when you're done, you can use:

```bash
docker stop app-instance-1 app-instance-2 tiny-url-zookeeper
docker rm app-instance-1 app-instance-2 tiny-url-zookeeper
```

7. Removing the Docker Image
If you want to remove the Docker image for your application, you can do so with:

```bash
docker rmi tiny-url-app
```

## Next steps

- Integrate with a NoSQL document DB
- Better config management
- Deploy using AWS
