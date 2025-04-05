.PHONY: lint

lint:
	cd forge && npx prettier --write .
	cd forge && npm run lint --fix .
	cd arena && npx prettier --write .
	cd arena && npm run lint --fix .
	cd server && poetry run black .
	cd server && poetry run isort .
	cd server && poetry run autoflake --in-place --remove-all-unused-imports --recursive .
