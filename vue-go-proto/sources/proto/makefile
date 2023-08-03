# Variables
ASDF ?= $(shell which asdf)
BUF = $(ASDF) exec buf

# Required commands
.PHONY: build install dev clean

build: dist/go dist/web

install: | build

dev: ;

clean: 
	rm -rf ./dist
	rm -rf ./node_modules

# Package targets
dist/go: buf.gen.go.yaml src/**/*
	$(BUF) generate --template buf.gen.go.yaml -v
	$(ASDF) exec go mod tidy

dist/web: buf.gen.web.yaml src/**/*
	$(BUF) generate --template buf.gen.web.yaml -v
	$(ASDF) exec pnpm install
