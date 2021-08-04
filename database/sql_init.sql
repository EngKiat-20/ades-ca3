DROP DATABASE IF EXISTS ades_ca3_p2020952;
CREATE DATABASE ades_ca3_p2020952;
USE ades_ca3_p2020952;

CREATE TABLE player_data(
	entry_id int not null primary key auto_increment,
	username varchar(255),
    score int not null
);