NAME=eventify
VOL=$(shell sudo docker volume ls -q)
PLATFORM := $(shell uname)
PREFIX=

ifeq ($(PLATFORM), Linux)
	PREFIX=sudo
endif

all:
	$(PREFIX) docker-compose -f docker-compose.yml up --build

stop:
	$(PREFIX) docker-compose -f docker-compose.yml down

prune: stop
	$(PREFIX) docker system prune -f -a --volumes

clean: prune
	$(PREFIX) rm -rf frontend/node_modules

fclean: clean
	$(PREFIX) rm -rf frontend/.cache $(PREFIX) rm -rf backend/logs/* && $(PREFIX) rm -rf backend/uploads/event_images/* && $(PREFIX) rm -rf backend/uploads/profile_pictures/* && $(PREFIX) docker volume rm $(VOL)
re: clean all
