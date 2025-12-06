#!/bin/bash

if [ -z "$1" ]; then
    echo 'Usage: ./createNew.sh <day-number>'
    exit 1
fi

dayNumber=$1

mkdir "$dayNumber"
cd "$dayNumber"
touch input.txt input-test.txt

create_ts_file() {
    cat > "$1" << 'EOF'
import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

EOF
}

create_ts_file 1.ts
create_ts_file 2.ts