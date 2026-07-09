BASE_FILE := $(shell npm ls --parseable --silent --workspaces=false "@mrpelz/boilerplate-common" 2>/dev/null)

include $(BASE_FILE)/Makefile

PACKAGE_LOCK_LINT_ARGS := $(PACKAGE_LOCK_LINT_ARGS) git.i.wurstsalat.cloud

# run build before typechecking in order to build inter-dependencies
check_typescript: transform_build
	$(SUB_RUN)

	tsc
