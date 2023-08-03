# Variables
ASDF ?= $(shell which asdf)
GO = $(ASDF) exec go
AIR = $(shell $(ASDF) exec go env GOPATH)/bin/air

# Required commands
.PHONY: build install dev clean

build: | install
	$(GO) build -o ./dist/

install: 
	$(GO) mod tidy -v
	$(GO) mod download

dev: | install
	$(AIR) -c .air.toml

clean:
	rm -rf ./dist
	rm -rf ./.air
