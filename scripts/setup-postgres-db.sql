-- Script SQL pour créer la base de données et l'utilisateur
-- Exécutez ce script en tant qu'administrateur PostgreSQL (postgres)

-- Créer l'utilisateur (ignore l'erreur si existe déjà)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'garden_user') THEN
    CREATE USER garden_user WITH PASSWORD 'dit8oand';
  END IF;
END
$$;

-- Créer la base de données (ignore l'erreur si existe déjà)
SELECT 'CREATE DATABASE garden_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'garden_db')\gexec

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE garden_db TO garden_user;

-- Se connecter à la base de données
\c garden_db

-- Donner les permissions sur le schéma public
GRANT ALL ON SCHEMA public TO garden_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO garden_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO garden_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO garden_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO garden_user;

-- Afficher un message de confirmation
SELECT 'Base de données garden_db et utilisateur garden_user créés avec succès!' AS message;

