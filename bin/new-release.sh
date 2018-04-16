#!/bin/sh
Green='\033[0;32m' 
BIGreen='\033[1;92m'
Color_Off='\033[0m'
echo $BIGreen"Latest releases: $Green"
git tag -l --sort -refname | head -n 3
echo $Color_Off
echo $1
echo $2
git tag -a "$1" -m "$2" && git push origin $1
