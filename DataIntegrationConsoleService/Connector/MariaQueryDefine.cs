using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Connector
{
    public class MariaQueryDefine
    {
        public const string createPastTable = "CREATE TABLE IF NOT EXISTS `{tableName}` (" +
                                                    " `idx` INT(11) NOT NULL AUTO_INCREMENT," +
                                                    " `category` VARCHAR(50) NULL DEFAULT NULL," +
                                                    " `rawdata` BLOB NULL," +
                                                    " `unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)," +
                                                    " PRIMARY KEY (`idx`)," +
                                                    " UNIQUE INDEX `unique_columns` (`unixtime`,`category`)" +
                                                " )" +
                                                " COLLATE='utf8_general_ci'" +
                                                " ENGINE=InnoDB;";

        public const string createCurrentTable = "CREATE TABLE IF NOT EXISTS `{tableName}` (" +
                                                    " `idx` INT(11) NOT NULL AUTO_INCREMENT," +
                                                    " `category` VARCHAR(50) NULL DEFAULT NULL," +
                                                    " `rawdata` BLOB NULL," +
                                                    " `unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)," +
                                                    " PRIMARY KEY (`idx`)," +
                                                    " UNIQUE INDEX `unique_columns` (`category`)," +
                                                    " INDEX `idx_columns` (`unixtime`)" +
                                                " )" +
                                                " COLLATE='utf8_general_ci'" +
                                                " ENGINE=InnoDB;";

        public const string GetSourceInformation = "SELECT TABLE_NAME FROM information_schema.`TABLES` WHERE TABLE_SCHEMA = 'datasourcebase' AND TABLE_NAME like 'current_%'";

        public const string GetSchema = "SET @@group_concat_max_len = 9999999999; SELECT GROUP_CONCAT(category) as categories, column_list " +
                                        " FROM ( " +
                                        " SELECT category, REPLACE(CAST(COLUMN_LIST(rawdata) as char),'`','') as column_list " +
                                        " FROM current_{source}) as result " +
                                        " GROUP BY result.column_list ";

        public const string getStructureInformation = "SELECT '{source}' as `source`, category, CAST(COLUMN_LIST(rawdata) as char) as `items` " +
                                                      "FROM current_{source} " +
                                                      "GROUP BY category ";

        public const string CreateFunction = "CREATE FUNCTION `SPLIT_TEXT`(`x` LONGTEXT, `delim` VARCHAR(12), `pos` INT)" +
                                            "	RETURNS longtext CHARSET utf8" +
                                            "	LANGUAGE SQL" +
                                            "	DETERMINISTIC" +
                                            "	CONTAINS SQL" +
                                            "	SQL SECURITY DEFINER" +
                                            "	COMMENT ''" +
                                            "RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos)," +
                                            "       CHAR_LENGTH(SUBSTRING_INDEX(x, delim, pos - 1)) + 1)," +
                                            "       delim, '');";
        public const string CreateProcedure = "CREATE PROCEDURE `DynamicQueryExecuter`(IN `queryText` LONGTEXT)" +
                                            "	LANGUAGE SQL" +
                                            "	NOT DETERMINISTIC" +
                                            "	CONTAINS SQL" +
                                            "	SQL SECURITY DEFINER" +
                                            "	COMMENT ''" +
                                            " BEGIN" +
                                            "	SET @count = 1;" +
                                            "	WHILE SPLIT_TEXT(queryText, ';', @count) != '' DO" +
                                            "		SET @SQLString = SPLIT_TEXT(queryText, ';', @count);" +
                                            "		PREPARE st FROM @SQLString;" +
                                            "		EXECUTE st;" +
                                            "		DEALLOCATE PREPARE st;" +
                                            "		SET @count = @count + 1;" +
                                            "	END WHILE;" +
                                            " END;";

        public const string CreateTableQuery = "CREATE TABLE IF NOT EXISTS `member` ( " +
                                            "   `idx` INT(11) NOT NULL AUTO_INCREMENT, " +
                                            "	`member_id` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`member_name` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`password` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`privilege` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`email` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`phone_number` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), " +
                                            "	PRIMARY KEY(`idx`), " +
                                            "	UNIQUE INDEX `unique_columns` (`member_id`), " +
                                            "	INDEX `index_columns` (`member_name`,`unixtime`) " +
                                            ") " +
                                            "COLLATE='utf8_general_ci' " +
                                            "ENGINE=InnoDB; " +
                                            "CREATE TABLE IF NOT EXISTS `data_view` ( " +
                                            "	`idx` INT(11) NOT NULL AUTO_INCREMENT, " +
                                            "	`member_id` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`name` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`view_type` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`view_query` TEXT NULL DEFAULT NULL, " +
                                            "   `view_options` BLOB NULL DEFAULT NULL, " +
                                            "	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), " +
                                            "	PRIMARY KEY(`idx`), " +
                                            "	UNIQUE INDEX `unique_columns` (`name`,`member_id`), " +
                                            "	INDEX `index_columns` (`unixtime`) " +
                                            ") " +
                                            "COLLATE='utf8_general_ci' " +
                                            "ENGINE=InnoDB; " +
                                            "CREATE TABLE IF NOT EXISTS `data_analysis` ( " +
                                            "	`idx` INT(11) NOT NULL AUTO_INCREMENT, " +
                                            "	`name` VARCHAR(50) NOT NULL, " +
                                            "	`target_source` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`analysis_query` TEXT NULL DEFAULT NULL, " +
                                            "	`action_type` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`options` BLOB NULL DEFAULT NULL, " +
                                            "	`schedule` BLOB NULL DEFAULT NULL, " +
                                            "	`status` VARCHAR(50) NULL DEFAULT 'stop', " +
                                            "	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), " +
                                            "	PRIMARY KEY(`idx`), " +
                                            "	UNIQUE INDEX `unique_columns` (`name`), " +
                                            "	INDEX `index_columns` (`target_source`, `unixtime`) " +
                                            ") " +
                                            "COLLATE='utf8_general_ci' " +
                                            "ENGINE=InnoDB; " +
                                            "CREATE TABLE IF NOT EXISTS `data_collection` ( " +
                                            "	`idx` INT(11) NOT NULL AUTO_INCREMENT, " +
                                            "	`name` VARCHAR(50) NOT NULL, " +
                                            "	`module_name` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`method_name` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`action_type` VARCHAR(50) NULL DEFAULT NULL, " +
                                            "	`options` BLOB NULL DEFAULT NULL, " +
                                            "	`schedule` BLOB NULL DEFAULT NULL, " +
                                            "	`status` VARCHAR(50) NULL DEFAULT 'stop', " +
                                            "	`unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), " +
                                            "	PRIMARY KEY(`idx`), " +
                                            "	UNIQUE INDEX `unique_columns` (`name`), " +
                                            "	INDEX `index_columns` (`module_name`, `method_name`, `unixtime`) " +
                                            ") " +
                                            "COLLATE='utf8_general_ci' " +
                                            "ENGINE=InnoDB;";
    }
}
