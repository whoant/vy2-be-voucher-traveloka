#!/bin/sh

cd "$(dirname "$0")"

for file in *.yaml
do
    sed -i -e "s/VERSION/$1/g" "$file"
done

kubectl apply -f ./
