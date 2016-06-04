#!/bin/sh

mkdir -p pub
rm -rf pub/*.html pub/dist pub/*.css
cp index.html oauth_callback.html main.css pub/
webpack --optimize-minimize
mkdir -p pub/dist
cp dist/bundle.js pub/dist/

# run webpack again so dev copies stay un-minified
webpack
