#!/bin/bash

# Check if a file is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

# Check if the file exists
if [ ! -f "$1" ]; then
  echo "File not found!"
  exit 1
fi

# Use sed to remove all # characters from the file
sed 's/#//g' "$1" > temp_file && mv temp_file "$1"

echo "All # characters removed from $1"
