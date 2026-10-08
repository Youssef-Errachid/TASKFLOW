CREATE TABLE task (
id            BIGINT AUTO_INCREMENT PRIMARY KEY,
titre         VARCHAR(100) NOT NULL,
description   VARCHAR(250) NOT NULL,
statut        VARCHAR(20)  NOT NULL,
priorite      VARCHAR(20)  NOT NULL,
deadline      DATETIME     NOT NULL,
date_creation  DATETIME     NOT NULL
);