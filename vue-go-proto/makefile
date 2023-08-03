# Variables
export ROOT = $(PWD)
export META = .make
export ASDF = $(shell which asdf || echo $HOME/.asdf/bin/asdf) 

ETS = $(shell $(ASDF) exec go env GOPATH)/bin/ets

# Targets to allow for parallel recursion in packages
PACKAGES = $(shell ls -d sources/*)
BUILD = $(PACKAGES:%=%/.build)
INSTALL = $(PACKAGES:%=%/.install)
DEV = $(PACKAGES:%=%/.dev)
CLEAN = $(PACKAGES:%=%/.clean)

# Available commands
.PHONY: build install dev clean setup 

build: | $(BUILD) 

install: node_modules | $(INSTALL) 

dev: | $(DEV) 

clean: | $(CLEAN) 
	rm -rf ./.make
	rm -rf ./node_modules

setup: | $(META)/.setup 

# Workspace targets
$(META)/.setup: $(ASDF) .tool-versions | $(META)
	-for PLUGIN in $$(cat .tool-versions | awk '{print $$1}'); do asdf plugin add $$PLUGIN; done
	$(ASDF) install
	$(ASDF) exec go install github.com/zmwangx/ets@latest
	$(ASDF) exec go install github.com/cosmtrek/air@latest
	$(ASDF) exec npm i -g pnpm
	touch $(META)/.setup

node_modules: package.json pnpm-lock.yaml pnpm-workspace.yaml $(META)/.setup
	$(ASDF) exec pnpm install

$(META):
	-mkdir -p $@

$(ASDF):
	git clone https://github.com/asdf-vm/asdf.git $HOME/.asdf --branch v0.11.3

# Package targets, brought to you by recursion
.PHONY: $(ALL) $(INSTALL) $(BUILD) $(DEV) $(CLEAN)

$(BUILD): $(META)/.setup
	-$(call RECURSION,$(@D),build)
sources/frontend/.build: | sources/proto/.build 
sources/server/.build: | sources/proto/.build 

$(INSTALL): $(META)/.setup
	-$(call RECURSION,$(@D),install)

$(DEV): $(META)/.setup
	-$(call RECURSION,$(@D),dev)

$(CLEAN): 
	-$(call RECURSION,$(@D),clean)

# Recusion function
# $1: Package directory
# $2: Make target
define RECURSION
	@$(ETS) -c -s -f "%T.%L $(notdir $(1))" $(MAKE) -C $(1) $(2)
endef
