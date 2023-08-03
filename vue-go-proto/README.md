### Setting up the workspace

This workspace uses GnuMake as its build tool.
Please use a Linux-based OS (ideally Ubuntu 22.04) and install `make` through your
package manager.

To keep tool versions synced among collaborators, this workspace uses `asdf`.
Either [install it yourself](https://asdf-vm.com/guide/getting-started.html) or run
`make setup` from the workspace root (NOTE: the setup target does not configure your
shell to allow for use outside this workspace).

### Running the workspace makefile

The workspace makefile is responsible for setting up all the tools needed by this repo.
It is also responsible for propagating calls to make through all packages.
The propagated commands, which are thus required in all packages, are: `build`,
`install`, `dev`, `clean`.
Make's default behaviour is to run the target specified target (or the one declared first
if run without arguments) and its dependencies synchronously, one after the other.
It is possible to ask for parallel execution of the tasks with the `-j` flag.
This flag is required when running the `dev` command, as some targets, like servers, may not exit.

### Creating a new package

Create the folder `./sources/<your-package>`.
Add a `makefile` inside the newly created folder.
The `makefile` needs to implement some rules to allow for recursion when invoked by the workspace.
It is therefore highly recommended to use this as the starting template for your makefiles:

```makefile
  # ./sources/<your-package>/makefile

  # Variables
  ASDF ?= $(shell which asdf)

  # Required commands
  .PHONY: build install dev clean

  build: dist | install
    $(ASDF) exec <plugin> build -o ./dist/

  install:
    $(ASDF) exec <plugin> install

  dev: | install
    $(ASDF) exec <plugin> dev

  clean:
    rm -rf ./dist

  # Package targets
  dist:
    -mkdir ./dist
    # the other build commands

```

Please keep `build` as the first target of your `makefile`.
Please favor running tools through `asdf` when possible.
Please use `<package>/dist` as the build folder for your package.
