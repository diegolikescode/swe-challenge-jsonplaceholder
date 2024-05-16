do:
	npm run dev

up:
	docker build -t applica-corp .
	docker-compose up --build

down:
	docker-compose down --volumes --remove-orphans

updown: down up
