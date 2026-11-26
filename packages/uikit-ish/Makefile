include .env
include .env.local
export

BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

PACKAGE_LOCK_LINT_ARGS := $(PACKAGE_LOCK_LINT_ARGS) git.i.wurstsalat.cloud
ESLINT_ARGS := $(ESLINT_ARGS) --ignore-pattern "demo/**/*"

GIT_BRANCH := $(shell git symbolic-ref --short HEAD)

SSG_DIR := demo/__ssg__

MITM_SLUG := $(shell echo "$(PKG_NAME)/$(GIT_BRANCH)" | sed -r -e 's#@##g' -e 's#/#-#g' 2>/dev/null)
MITM_URL := https://$(MITM_SLUG).localhost

WEBPACK := WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG=true npm exec -- webpack-cli

.PHONY: .PHONY \
	check_browser \
	transform_build_demo \
	transform_build_demo_csr \
	transform_build_demo_ssg \
	transform_icons \
	util_claude \
	util_clear_demo \
	util_mitmproxy \
	util_mitmproxy_0 \
	watch_dev_proxy \
	watch_screens

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
	mv "demo/index.html" "demo/template.html"
	node "$(SSG_DIR)/main.js"
	rm -rf "$(SSG_DIR)"

# The demo's icons, from src/demo/assets/icon.svg (needs Chrome).
transform_icons:
	node scripts/icons.js

transform_prod_demo: \
	util_clear_demo \
	transform_build_demo

util_claude:
	claude --resume 39433362-8325-4994-aad6-34aa81e3db0e --remote-control

util_clear_demo:
	rm -rf demo/{*,.*}

util_mitmproxy:
	clear; \

	@echo
	@echo http://localhost:8081/?token=$(MITM_SLUG)
	@echo $(MITM_URL)
	@echo \

	mitmweb --no-web-open-browser --set termlog_verbosity=error --set web_password="$(MITM_SLUG)" --mode "reverse:http://localhost:3000@443";

util_mitmproxy_0:
	mitmweb --no-web-open-browser --set block_global=false --set termlog_verbosity=warn --set web_password="$(MITM_SLUG)" --mode "reverse:http://localhost:3000@4443";

watch_build:
	tsc --project tsconfig.build.json --watch

watch_build_demo: util_clear_demo
	$(WEBPACK) serve

watch_dev_proxy:
	scripts/watch-dev-proxy.sh

# The watchers in named, detached screen sessions (make-demo, make-lint,
# make-stylelint), each quit first if it's running; attach with
# `screen -r <name>`. Optional: make watch_screens SCREENS='demo lint'
SCREENS ?= demo lint stylelint mitmproxy claude
watch_screens:
	@for name in $(SCREENS); do \
		case "$$name" in \
			demo) target=watch_build_demo ;; \
			lint) target=watch_lint ;; \
			stylelint) target=watch_stylelint ;; \
			mitmproxy) target=util_mitmproxy_0 ;; \
			claude) target=util_claude ;; \
			*) echo "unknown screen: $$name" >&2; exit 1 ;; \
		esac; \
		screen -S "make-$$name" -X quit >/dev/null 2>&1; \
		screen -dmS "make-$$name" sh -c "make $$target; exec $$SHELL"; \
		echo "make-$$name: make $$target"; \
	done
