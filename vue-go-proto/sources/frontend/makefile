# Variables
ASDF ?= $(shell which asdf)
PNPM = $(ASDF) exec pnpm

# Required commands
.PHONY: build install dev clean

build: | install
	$(PNPM) build

install:
	$(PNPM) install

dev: | install
	$(PNPM) dev

clean: 
	rm -rf ./node_modules
	rm -rf ./dist
