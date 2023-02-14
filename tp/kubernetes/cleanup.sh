#!/bin/bash

# Prompt user for the word to search for

parent_name=$(basename $(dirname $(pwd)))

rm -rf $parent_name-default-networkpolicy.yaml

word="io.kompose.network"

# Loop through all files in the current directory
for file in *; do
  # Find the line number of the occurrence of the word
  line_number=$(grep -n "$word" "$file" | awk -F: '{print $1}')

  # Delete the line if it was found
  if [ -n "$line_number" ]; then
    sed -i "${line_number}d" "$file"
    echo "The line containing '$word' has been deleted from $file."
  else
    echo "The word '$word' was not found in $file."
  fi
done