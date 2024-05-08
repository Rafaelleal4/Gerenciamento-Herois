CREATE DATABASE herois;

CREATE TABLE herois (
    id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    classe VARCHAR(100) NOT NULL,
    nivel INT NOT NULL,
    vida INT NOT NULL
);

CREATE TABLE batalhas (
    id SERIAL PRIMARY KEY,
    heroi1_id INTEGER REFERENCES herois(id),
    heroi2_id INTEGER REFERENCES herois(id),
    vencedor_id INTEGER REFERENCES herois(id),
    resultado TEXT
);