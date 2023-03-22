#!/bin/bash

VERSION=""
FIRST_TAG=false
BASE_BRANCH=""

#get parameters
while getopts "v:b:" arg
do
  case "${arg}" in
    v) VERSION=${OPTARG};;
	b) BASE_BRANCH=${OPTARG};;
  esac
done

if [[ $BASE_BRANCH == '' ]]; then
	echo "No base branch specified. try: -b [BRANCH_NAME]"
	exit 1
else
	echo "Base branch $BASE_BRANCH"
fi

#check if branch exists
git ls-remote --exit-code --heads origin $BASE_BRANCH >/dev/null 2>&1
EXIT_CODE=$?

if [[ $EXIT_CODE == '0' ]]; then
  echo "Git branch '$BASE_BRANCH' exists in the remote repository"
elif [[ $EXIT_CODE == '2' ]]; then
  echo "Git branch '$BASE_BRANCH' does not exist in the remote repository"
  exit 2
fi

#get highest tag number, and add 1.0.0 if doesn't exist
CURRENT_VERSION=`git describe --abbrev=0 --tags 2>/dev/null`

if [[ $CURRENT_VERSION == '' ]]; then
  CURRENT_VERSION='1.0.0'
  FIRST_TAG=true
  echo "No previous tag"
else
	echo "Current Version: $CURRENT_VERSION"
fi


#replace . with space so can split into an array
CURRENT_VERSION_PARTS=(${CURRENT_VERSION//./ })

#get number parts
VNUM1=${CURRENT_VERSION_PARTS[0]}
VNUM2=${CURRENT_VERSION_PARTS[1]}
VNUM3=${CURRENT_VERSION_PARTS[2]}

if [[ $FIRST_TAG == false ]]; then
	if [[ $VERSION == 'major' ]]; then
	  VNUM1=$((VNUM1+1))
	elif [[ $VERSION == 'minor' ]]; then
	  VNUM2=$((VNUM2+1))
	elif [[ $VERSION == 'patch' ]]; then
	  VNUM3=$((VNUM3+1))
	else
	  echo "No version type or incorrect type specified, try: -v [major, minor, patch]"
	  exit 1
	fi
fi


#create new tag
NEW_TAG="$VNUM1.$VNUM2.$VNUM3"
if [[ $FIRST_TAG == false ]]; then
	echo "($VERSION) updating $CURRENT_VERSION to $NEW_TAG"
else
	echo "Tagging with default value $NEW_TAG"
fi

#get current hash and see if it already has a tag
GIT_COMMIT=`git rev-parse HEAD`
NEEDS_TAG=`git describe --contains $GIT_COMMIT 2>/dev/null`

#get if new branch already exists
NEW_BRANCH="release-$NEW_TAG"
git ls-remote --exit-code --heads origin $NEW_BRANCH >/dev/null 2>&1
EXIT_CODE=$?

#only tag if no tag already
if [ -z "$NEEDS_TAG" ]; then
	if [[ $EXIT_CODE == '0' ]]; then
	  echo "Branch '$NEW_BRANCH' already exists in the remote repository"
	  exit 1
	elif [[ $EXIT_CODE == '2' ]]; then
	  echo "Create branch $NEW_BRANCH"
	  # git branch $NEW_BRANCH $BASE_BRANCH
	  echo "Push branch $NEW_BRANCH to remote"
	  # git push --set-upstream origin $NEW_BRANCH
	fi
else
  echo "Already a tag on this commit"
fi

exit 0