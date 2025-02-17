#!/bin/bash
# Ensure the script is executable by running: chmod +x runme.sh

# Function to start a service
start_service() {
    service=$1
    port=$2
    echo "Starting $service service on port $port..."
    python3 manage.py runserver $port &
    BACKGROUND_PIDS+=($!)  # Store the PID of the background process
}

# Function to perform a fresh start (migrations, npm install, etc.) and start the service
freshstart_service() {
    service=$1
    port=$2
    echo "Performing fresh start for $service service..."

    # Django: Make migrations and migrate
    if [[ "$service" == "control" || "$service" == "iscs" || "$service" == "user" ]]; then
        echo "Making migrations and migrating for $service..."
        python3 manage.py makemigrations
        python3 manage.py migrate
    fi

    # React: npm install
    if [[ "$service" == "frontend" ]]; then
        echo "Running npm install for frontend..."
        npm install --legacy-peer-deps
    fi

    # Start the service after preparation
    echo "Starting $service service after fresh start..."
    if [[ "$service" == "frontend" ]]; then
        npm start &
        BACKGROUND_PIDS+=($!)  # Store the PID of the background process
    else
        start_service $service $port
    fi
}

# Function to flush the service database
flush_db() {
    if [[ "$1" == "user" ]]; then
        echo "Flushing database for user service..."
        python3 manage.py flush --no-input
    else
        echo "Flush is only supported for the data tier services."
    fi
}

# Function to handle backend services
handle_backend() {
    action=$1
    service=$2
    port=$3

    case "$service" in 
        "control")
            cd backend-services/control/control_project
            ;;
        "iscs")
            cd backend-services/ISCS
            ;;
        "user")
            cd backend-services/user/receive_and_save_user_details
            ;;
    esac

    case "$action" in
        "start")
        start_service $service $port
        ;;
        "freshstart")
        freshstart_service $service $port
        ;;
        "flush")
        flush_db $service
    esac

    cd -
}

# Function to handle frontend service
handle_frontend() {
    action=$1

    cd frontend/jiraclone
    if [[ "$action" == "start" ]]; then
        echo "Starting frontend service..."
        npm start &
        BACKGROUND_PIDS+=($!)  # Store the PID of the background process
    elif [[ "$action" == "freshstart" ]]; then
        freshstart_service "frontend" 3000
    else
        echo "Frontend service does not support flush."
    fi
    cd -
}

# Function to clean up background processes
cleanup() {
    echo "Stopping all background processes..."
    for pid in "${BACKGROUND_PIDS[@]}"; do
        echo "Stopping process $pid..."
        kill $pid 2>/dev/null
    done
    exit 0
}

# Trap Ctrl+C (SIGINT) and call the cleanup function
trap cleanup SIGINT

# Main script logic
if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <action> [flags]"
    echo "Actions: start, freshstart, flush"
    echo "Flags:"
    echo "  -a  All services"
    echo "  -b  All backend services"
    echo "  -f  Frontend service"
    echo "  -c  Control service"
    echo "  -i  ISCS service"
    echo "  -u  User service"
    exit 1
fi

# Parse action
action=$1
shift

# Parse flags
flags=""
while getopts "abfciu" opt; do
    case $opt in
        a) flags+="all " ;;
        b) flags+="backend " ;;
        f) flags+="frontend " ;;
        c) flags+="control " ;;
        i) flags+="iscs " ;;
        u) flags+="user " ;;
        *) echo "Unknown flag: -$opt" && exit 1 ;;
    esac
done

# If no specific flags are provided, default to all services
if [[ -z "$flags" ]]; then
    flags="all"
fi

# Handle services based on flags
for flag in $flags; do
    case $flag in
        all)
            handle_backend $action "control" 10001
            handle_backend $action "iscs" 8001
            handle_backend $action "user" 8000
            handle_frontend $action
            ;;
        backend)
            handle_backend $action "control" 10001
            handle_backend $action "iscs" 8001
            handle_backend $action "user" 8000
            ;;
        frontend)
            handle_frontend $action
            ;;
        control)
            handle_backend $action "control" 10001
            ;;
        iscs)
            handle_backend $action "iscs" 8001
            ;;
        user)
            handle_backend $action "user" 8000
            ;;
    esac
done

# Wait for all background processes to finish
wait