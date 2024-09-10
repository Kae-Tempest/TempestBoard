# TempestBoard

## TempestBoard is Project Gestionnary like [Jira](https://www.atlassian.com/fr/software/jira) or [Linear](https://linear.app/)

- Front : ![Nuxt](https://img.shields.io/badge/-Nuxt-%FF61DAFB?style=for-the-badge&logo=nuxt.js&logoColor=white)
- BDD : ![PgSQL](https://img.shields.io/badge/PgSQL-005C84?style=for-the-badge&logo=postgresql&logoColor=white)
- Back : ![Django](https://img.shields.io/badge/-Django-0a3c29?style=for-the-badge&logo=django&logoColor=white)
- Docker : ✅
- Maquette : [Figma](https://www.figma.com/design/vemwaPRhJGu4l6wu7rfIeO/TempestBoard?node-id=0-1&t=PDlt6zFb6gvx1Xrq-1)

## Installation

### After Cloning repository

#### Docker
You can change dockerfile of front file for prod or dev mode

#### .ENV
Modify example.env to .env and modify .env content if you need

#### Linux / Mac OS
```bash
cd TempestBoard
sudo docker compose up -d
sudo docker compose exec django python manage.py migrate
```

#### Windows
```bash
cd TempestBoard
docker-compose up -d
docker-compose exec django python manage.py migrate
```

