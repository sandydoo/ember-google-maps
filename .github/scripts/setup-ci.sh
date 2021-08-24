#!/usr/bin/env bash

WHERE=https://ember-google-maps.s3.eu-west-1.amazonaws.com/46830d7e7843d054dc6ab36416baf9dd942126f9.txt.gpg

if [ -z $GOOGLE_MAPS_API_KEY ]
then
  KEY=$(curl -s $WHERE | gpg --quiet --yes --batch --decrypt --passphrase="a hamster in the rye")
  echo "GOOGLE_MAPS_API_KEY=$KEY" >> $GITHUB_ENV
fi
