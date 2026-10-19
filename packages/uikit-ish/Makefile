include .env
include .env.local
export

BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

PACKAGE_LOCK_LINT_ARGS := $(PACKAGE_LOCK_LINT_ARGS) git.i.wurstsalat.cloud
ESLINT_ARGS := $(ESLINT_ARGS) --ignore-pattern "demo/**/*"

GIT_BRANCH := $(shell git symbolic-ref --short HEAD)

MITM_SLUG := $(shell echo "$(PKG_NAME)/$(GIT_BRANCH)" | sed -r -e 's#@##g' -e 's#/#-#g' 2>/dev/null)
MITM_URL := https://$(MITM_SLUG).localhost

.PHONY: .PHONY \
	check_browser \
	transform_build_demo \
	transform_build_demo_csr \
	transform_build_demo_ssg \
	util_clear_demo \
	util_mitmproxy \
	watch_dev_proxy

# Headless browser tests of the demo (needs Chrome, see scripts/browser-tests).
# Optional: make -s check_browser ARGS='[<filter>] [--changed] [--screenshots <dir>]'
# (--changed: only the tests affected by uncommitted changes)
check_browser:
	node scripts/browser-tests/run.js $(ARGS)

transform: \
	transform_package_json \
	transform_lint \
	transform_stylelint \
	transform_build \
	transform_build_demo

transform_build:
	tsc --project tsconfig.build.json
	scripts/copy-css.sh

transform_build_demo: \
	transform_build_demo_csr \
	transform_build_demo_ssg

transform_build_demo_csr:
	$(WEBPACK)

transform_build_demo_ssg:
	$(WEBPACK) --config webpack-ssg.config.js

transform_prod_demo: \
	util_clear_demo \
	transform_build_demo

util_clear_demo:
	rm -rf demo/{*,.*}

util_mitmproxy:
	clear; \

	@echo
	@echo http://localhost:8081/?token=$(MITM_SLUG)
	@echo $(MITM_URL)
	@echo \

	mitmweb --no-web-open-browser --set termlog_verbosity=error --set web_password="$(MITM_SLUG)" --mode "reverse:http://localhost:3000@443";

watch_build:
	tsc --project tsconfig.build.json --watch

watch_build_demo: util_clear_demo
	$(WEBPACK) serve

watch_dev_proxy:
	scripts/watch-dev-proxy.sh
