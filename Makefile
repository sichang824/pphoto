# Makefile

# Include environment variables
include .env.prod

# Variables
PLATFORM = $(DOCKER_BUILD_PLATFORM)
DOCKERFILE_TARGET = $(DOCKER_BUILD_DOCKERFILE_TARGET)
IMAGE = $(DOCKER_BUILD_DOCKER_IMAGE):$(DOCKER_BUILD_DOCKER_IMAGE_TAG)

# Phony targets
.PHONY: all build docker-build docker-push clean

# Default target
all: 

# Build the project
build: docker-build docker-push clean

# Build the Docker image
docker-build:
	docker build -t $(IMAGE) --platform=$(PLATFORM) -f Dockerfile --target=$(DOCKERFILE_TARGET) .

# Push the Docker image
docker-push:
	docker push $(IMAGE)

# Clean up
clean:
