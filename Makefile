.PHONY: lint start-server start-forge start-arena start

lint:
	cd forge && npx prettier --write .
	cd forge && npm run lint --fix .
	cd arena && npx prettier --write .
	cd arena && npm run lint --fix .
	cd server && poetry run black .
	cd server && poetry run isort .
	cd server && poetry run autoflake --in-place --remove-all-unused-imports --recursive .

start-server:
	cd server && poetry run uvicorn app.api.main:app --reload --host 0.0.0.0 --port 8080 --env-file .env

start-forge:
	cd forge && npm run dev

start-arena:
	cd arena && npm run dev

