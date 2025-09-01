#!/bin/bash
###########################################
# DEPRECATED - This script uses removed files
# This script has been kept for reference but should not be used
# Use run-ios-demo-test.sh instead
###########################################

# Source common utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/common.sh"

log_warning "This script is deprecated as it depends on files that have been moved to backup."
log_warning "Please use './scripts/run-ios-demo-test.sh' instead."
exit 1
