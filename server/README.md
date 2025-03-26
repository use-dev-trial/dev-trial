# Forge Server

Forge Server is the backend service that provides the core functionality for Forge.

## Set up Poetry

Please follow the official [installation guide](https://python-poetry.org/docs/#installation) to install Poetry, which will be used to manage dependencies and environments.

```bash
# Install dependencies
poetry install
```

```bash
# Activate Python Virtual Environment for Mac/Linux
eval "$(poetry env activate)"

# Activate Python Virtual Environment for Windows
.venv\Scripts\Activate.ps1
```

## Set up environment variables

```bash
# Create .env file (by copying from .env.example)
cp .env.example .env
```

## Quick Start

To spin up the server, run the following command at the `server` directory:

```bash
# For local development, and if hosting service allows us to manually create the .env file
poetry run uvicorn app.api.main:app --reload --host 0.0.0.0 --port 8080 --env-file .env
```
