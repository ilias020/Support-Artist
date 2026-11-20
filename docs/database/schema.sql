-- Databaseschema van Support Artist, afgeleid uit het ERD (support-artist.mwb).

CREATE DATABASE IF NOT EXISTS support_artist_db;
USE support_artist_db;

CREATE TABLE userroles (
	UserRole VARCHAR(20) NOT NULL,
	PRIMARY KEY (UserRole)
);

CREATE TABLE userstatus (
	UserStatus VARCHAR(20) NOT NULL,
	PRIMARY KEY (UserStatus)
);

CREATE TABLE contactstatus (
	MessageStatus VARCHAR(20) NOT NULL,
	PRIMARY KEY (MessageStatus)
);

CREATE TABLE subscriptiontypes (
	SubscriptionName VARCHAR(20) NOT NULL,
	Price INT NOT NULL,
	PRIMARY KEY (SubscriptionName)
);

CREATE TABLE users (
	UserName VARCHAR(20) NOT NULL,
	Email VARCHAR(30) NOT NULL,
	FirstName VARCHAR(20) NOT NULL,
	LastName VARCHAR(20) NOT NULL,
	Password VARCHAR(255) NOT NULL,
	UserStatus VARCHAR(20) NOT NULL,
	UserRole VARCHAR(20) NOT NULL,
	PRIMARY KEY (UserName),
	UNIQUE KEY Email (Email),
	FOREIGN KEY (UserRole) REFERENCES userroles (UserRole),
	FOREIGN KEY (UserStatus) REFERENCES userstatus (UserStatus)
);

CREATE TABLE artists (
	ArtistName VARCHAR(20) NOT NULL,
	AboutMe VARCHAR(200) NOT NULL,
	UserName VARCHAR(20) NOT NULL,
	PRIMARY KEY (ArtistName),
	UNIQUE KEY UserName (UserName),
	FOREIGN KEY (UserName) REFERENCES users (UserName)
);

CREATE TABLE posts (
	Description VARCHAR(200) NOT NULL,
	PostTime TIMESTAMP NOT NULL,
	ArtistName VARCHAR(20) NOT NULL,
	PRIMARY KEY (ArtistName, PostTime),
	FOREIGN KEY (ArtistName) REFERENCES artists (ArtistName)
);

CREATE TABLE subscriptions (
	UserName VARCHAR(20) NOT NULL,
	ArtistName VARCHAR(20) NOT NULL,
	SubscriptionName VARCHAR(20) NOT NULL,
	StartDate TIMESTAMP NOT NULL,
	SubscriptionStatus TINYINT NOT NULL,
	PRIMARY KEY (UserName, StartDate),
	FOREIGN KEY (UserName) REFERENCES users (UserName),
	FOREIGN KEY (ArtistName) REFERENCES artists (ArtistName),
	FOREIGN KEY (SubscriptionName) REFERENCES subscriptiontypes (SubscriptionName)
);

CREATE TABLE contactforms (
	Message VARCHAR(255) NOT NULL,
	FormTime TIMESTAMP NOT NULL,
	UserName VARCHAR(20) NOT NULL,
	MessageStatus VARCHAR(20) NOT NULL,
	PRIMARY KEY (UserName, FormTime),
	FOREIGN KEY (UserName) REFERENCES users (UserName),
	FOREIGN KEY (MessageStatus) REFERENCES contactstatus (MessageStatus)
);

CREATE TABLE favoriteartists (
	ArtistName VARCHAR(20) NOT NULL,
	UserName VARCHAR(20) NOT NULL,
	PRIMARY KEY (ArtistName, UserName),
	FOREIGN KEY (ArtistName) REFERENCES artists (ArtistName),
	FOREIGN KEY (UserName) REFERENCES users (UserName)
);

CREATE TABLE ratings (
	ArtistName VARCHAR(20) NOT NULL,
	UserName VARCHAR(20) NOT NULL,
	Rating INT NOT NULL,
	RatingTime TIMESTAMP NOT NULL,
	PRIMARY KEY (UserName, RatingTime),
	FOREIGN KEY (ArtistName) REFERENCES artists (ArtistName),
	FOREIGN KEY (UserName) REFERENCES users (UserName)
);

CREATE TABLE reports (
	UserName VARCHAR(20) NOT NULL,
	ArtistName VARCHAR(20) NOT NULL,
	Reason VARCHAR(255) NOT NULL,
	ReportTime TIMESTAMP NOT NULL,
	PRIMARY KEY (UserName, ReportTime),
	FOREIGN KEY (ArtistName) REFERENCES artists (ArtistName),
	FOREIGN KEY (UserName) REFERENCES users (UserName)
);

INSERT INTO userroles (UserRole) VALUES ('User'), ('Artist'), ('Admin');
INSERT INTO userstatus (UserStatus) VALUES ('Active'), ('Banned');
INSERT INTO contactstatus (MessageStatus) VALUES ('Pending'), ('In progress'), ('Resolved');
INSERT INTO subscriptiontypes (SubscriptionName, Price) VALUES ('Basic', 4), ('Standard', 6), ('Pro Supporter', 10);
