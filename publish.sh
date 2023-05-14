#!/bin/bash

set -ex
cd "$(dirname "$0")"

ENVIRONMENT_LIST_CSV="local.env"

# grab any modifications from the command line.
for i in "$@"; do
    case $i in
        --environments-csv=*)
            ENVIRONMENT_LIST_CSV="${i#*=}"
            shift
        ;;
        *)
        ;;
    esac
done

# we run a git push to push the front-end changes to origin main branch.
#git push

cd ..

if [ ! -d "./clams-app-docker" ]; then
    git clone https://github.com/farscapian/clams-app-docker "$CLAMS_DOCKER_APP_PATH"
fi

cd ./clams-app-docker
git pull

# Use IFS to set the delimiter to comma
IFS=','

# get the active_env value that's in there before we run our script.
STARTING_ACTIVE_ENV=$(cat ./active_env.txt | head -n1 | awk '{print $1;}')

# loop over each active env and run up.sh
for ACTIVE_ENV in $ENVIRONMENT_LIST_CSV; do
    echo -n "$ACTIVE_ENV" > ./active_env.txt
    ./reset.sh "$@"
done

echo -n "$STARTING_ACTIVE_ENV" > ./active_env.txt
