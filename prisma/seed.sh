#!/bin/bash

# Source the .env file to get the DATABASE_URL
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL is not set in the .env file"
    exit 1
fi

# Run the psql command to import the CSV data
psql $DATABASE_URL -c "\copy \"Location\"(location_name, address, province, city, latitude, longitude, type, category) from 'prisma/seed/bank_data.csv' with (FORMAT csv, HEADER true)"

echo "Data import completed"
