CREATE DATABASE IF NOT EXISTS `integrationdata`;
USE `integrationdata`;

CREATE TABLE `fieldinfo` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`Source` VARCHAR(50) NULL DEFAULT NULL,
	`Field` VARCHAR(50) NULL DEFAULT NULL,
	`end` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`start` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `UNQ_SourceField` (`Field`, `Source`),
	INDEX `IDX_start` (`start`),
	INDEX `IDX_end` (`end`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE `sourcedata` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`Source` VARCHAR(50) NULL DEFAULT NULL,
	`SourceData` BLOB NULL,
	`UnixTimeStamp` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	INDEX `IDX_Source` (`Source`),
	INDEX `IDX_UnixTimeStamp` (`UnixTimeStamp`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE `metricinfo` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`ObjectId` VARCHAR(50) NULL DEFAULT NULL,
	`Metric` VARCHAR(50) NULL DEFAULT NULL,
	`end` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`start` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `UNQ_Keys` (`ObjectId`, `Metric`),
	INDEX `IDX_start` (`start`),
	INDEX `IDX_end` (`end`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE `objectdata` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`ObjectId` VARCHAR(50) NULL DEFAULT NULL,
	`ObjectData` BLOB NULL,
	`UnixTimeStamp` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `UNQ_Keys` (`objectid`, `UnixTimeStamp`),
	INDEX `IDX_ObjectId` (`objectid`),
	INDEX `IDX_UnixTimeStamp` (`UnixTimeStamp`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE FUNCTION `SPLIT_TEXT`(`x` LONGTEXT, `delim` VARCHAR(12), `pos` INT)
	RETURNS longtext CHARSET utf8
	LANGUAGE SQL
	DETERMINISTIC
	CONTAINS SQL
	SQL SECURITY DEFINER
	COMMENT ''
RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       CHAR_LENGTH(SUBSTRING_INDEX(x, delim, pos - 1)) + 1),
       delim, '');

DELIMITER $$
CREATE PROCEDURE `DynamicQueryExecuter`(IN `queryText` LONGTEXT)
	LANGUAGE SQL
	NOT DETERMINISTIC
	CONTAINS SQL
	SQL SECURITY DEFINER
	COMMENT ''
BEGIN
	SET @count = 1;
	WHILE SPLIT_TEXT(queryText, ';', @count) != '' DO
		SET @SQLString = SPLIT_TEXT(queryText, ';', @count);
		PREPARE st FROM @SQLString;
		EXECUTE st;
		DEALLOCATE PREPARE st;
	
		SET @count = @count + 1;
	END WHILE;
END $$
DELIMITER ;


/*------------------------------------------------------------------------------------------------------------------*/

CREATE TABLE IF NOT EXISTS `member` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`member_id` VARCHAR(50) NULL DEFAULT NULL,
	`member_name` VARCHAR(50) NULL DEFAULT NULL,
	`password` VARCHAR(50) NULL DEFAULT NULL,
	`privilege` VARCHAR(50) NULL DEFAULT NULL,
	`email` VARCHAR(50) NULL DEFAULT NULL,
	`phone_number` VARCHAR(50) NULL DEFAULT NULL,
	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `unique_columns` (`member_id`),
	INDEX `index_columns` (`member_name`,`unixtime`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `data_view` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`member_id` VARCHAR(50) NULL DEFAULT NULL,
	`name` VARCHAR(50) NULL DEFAULT NULL,
	`view_type` VARCHAR(50) NULL DEFAULT NULL,
	`view_query` TEXT NULL DEFAULT NULL,
	`view_options` BLOB NULL DEFAULT NULL,
	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `unique_columns` (`name`,`member_id`),
	INDEX `index_columns` (`unixtime`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `data_analysis` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	`target_source` VARCHAR(50) NULL DEFAULT NULL,
	`analysis_query` TEXT NULL DEFAULT NULL,
	`action_type` VARCHAR(50) NULL DEFAULT NULL,
	`options` BLOB NULL DEFAULT NULL,
	`schedule` BLOB NULL DEFAULT NULL,
	`status` VARCHAR(50) NULL DEFAULT 'stop',
	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `unique_columns` (`name`),
	INDEX `index_columns` (`target_source`, `unixtime`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `data_collection` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	`module_name` VARCHAR(50) NULL DEFAULT NULL,
	`method_name` VARCHAR(50) NULL DEFAULT NULL,
	`action_type` VARCHAR(50) NULL DEFAULT NULL,
	`options` BLOB NULL DEFAULT NULL,
	`schedule` BLOB NULL DEFAULT NULL,
	`status` VARCHAR(50) NULL DEFAULT 'stop',
	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `unique_columns` (`name`),
	INDEX `index_columns` (`module_name`, `method_name`, `unixtime`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

INSERT INTO member (member_id, member_name, password, privilege, email, phone_number) values ('admin', 'admin', 'soul1087', 'super','sukan8822@gmail.com', '01057721447');

CREATE TABLE `current_` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`source` VARCHAR(50) NULL DEFAULT NULL,
	`rawdata` BLOB NULL,
	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	INDEX `IDX_Columns` (`source`, `unixtime`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE `past_` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`source` VARCHAR(50) NULL DEFAULT NULL,
	`rawdata` BLOB NULL,
	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`idx`),
	INDEX `IDX_Columns` (`source`, `unixtime`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

