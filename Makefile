start:
	@echo "Starting the application using Docker Compose..."
	docker-compose up -d
	@echo "Application started successfully!"
	pnpm start