CREATE DATABASE herois;

CREATE TABLE heroi (
    id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    classe VARCHAR(100) NOT NULL,
    nivel INT NOT NULL,
    vida INT NOT NULL
);

CREATE TABLE batalhas (
    id INT PRIMARY KEY,
    heroi_id1 INT NOT NULL,
    heroi_id2 INT NOT NULL,
    vencedor_id INT NOT NULL,
    FOREIGN KEY (heroi_id1) REFERENCES heroi(id),
    FOREIGN KEY (heroi_id2) REFERENCES heroi(id),
    FOREIGN KEY (vencedor_id) REFERENCES heroi(id)
);