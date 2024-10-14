db:
	@docker exec -it jobs_api sh -c 'cd sequelize && npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all'

up:
	@echo "Starting containers..."
	@docker compose up -d

down:
	@echo "Stopping containers..."
	@docker compose down

build:
	@echo "Building containers..."
	@docker compose up --build -d

logs:
	@echo "Showing logs..."
	@docker compose logs -f $(container)
	