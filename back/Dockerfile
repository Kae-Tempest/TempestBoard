# Utilisation de l'image de base Python
FROM python:3.12-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier seulement requirements.txt dans le conteneur
COPY ./requirements.txt /app/

# Installer les dépendances
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copier le reste du projet dans le conteneur
COPY . /app

# Exposer le port 8000 (port par défaut de Django)
EXPOSE 8000

#RUN python manage.py migrate

# Commande par défaut pour lancer l'application
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
# PROD
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "TempestBoard.asgi:application"]