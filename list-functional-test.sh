#!/bin/sh

cat Forum\ API\ V2\ Test/Forum\ API\ V2\ Test.postman_collection.json | jq '.item[] | { name: .name, count: [.item[].name] | length, item: [.item[].name] }'