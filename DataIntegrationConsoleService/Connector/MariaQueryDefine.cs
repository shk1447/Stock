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
                                                    " UNIQUE INDEX `unique_columns` (`unixtime`,`category`)," +
                                                    " INDEX `idx_columns` (`unixtime`,`category`)," +
                                                    " INDEX `idx_category` (`category`)," +
                                                    " INDEX `idx_unixtime` (`unixtime`)" +
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
                                                    " INDEX `idx_columns` (`unixtime`,`category`)," +
                                                    " INDEX `idx_category` (`category`)," +
                                                    " INDEX `idx_unixtime` (`unixtime`)" +
                                                " )" +
                                                " COLLATE='utf8_general_ci'" +
                                                " ENGINE=InnoDB;";

        public const string GetSourceInformation = "SELECT TABLE_NAME FROM information_schema.`TABLES` WHERE TABLE_SCHEMA = 'datasourcebase' AND TABLE_NAME like 'current_%'";

        public const string GetSchema = "SET @@group_concat_max_len = 9999999999; SELECT GROUP_CONCAT(category) as categories, column_list " +
                                        " FROM ( " +
                                        " SELECT category, REPLACE(CAST(COLUMN_LIST(rawdata) as char),'`','') as column_list " +
                                        " FROM fields_{source}) as result " +
                                        " GROUP BY result.column_list ";
        public const string GetVolumeOscillator = "DROP TABLE IF EXISTS `temp_volume`; CREATE TEMPORARY TABLE IF NOT EXISTS `temp_volume`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`전일비율` varchar(50),`거래량` varchar(50),`단기거래량` decimal(20,2),`장기거래량` decimal(20,2),`temp` decimal(20,2),`temp2` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, '전일비율' as char) as `전일비율`, COLUMN_GET(`rawdata`, '거래량' as char) as `거래량`, unixtime as `날짜` FROM past_stock WHERE category ='{category}' AND COLUMN_GET(`rawdata`, '거래량' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC; SET @ema_intervals = 5;SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `temp_volume` SET temp = @prev_ema := (case when `temp_volume`.idx = 1 then `temp_volume`.`거래량` else `temp_volume`.`거래량` * @k + @prev_ema * (1 - @k) end), `단기거래량` = temp, `날짜` = `날짜`; SET @ema_intervals = 20;SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `temp_volume` SET temp2 = @prev_ema := (case when `temp_volume`.idx = 1 then `temp_volume`.`거래량` else `temp_volume`.`거래량` * @k + @prev_ema * (1 - @k) end), `장기거래량` = temp2, `날짜` = `날짜`; SELECT AVG(`전일비율`) as `전일비율`, (AVG(`단기거래량`) - AVG(`장기거래량`)) / AVG(`단기거래량`) * 100 as `VOLUME_SIGNAL`, UNIX_TIMESTAMP(`날짜`) as `unixtime` FROM `temp_volume`";
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
                                            "	INDEX `index_member_name` (`member_name`), " +
                                            "	INDEX `index_unixtime` (`unixtime`) " +
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
                                            "	INDEX `index_target_source` (`target_source`), " +
                                            "	INDEX `index_unixtime` (`unixtime`) " +
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
                                            "	INDEX `index_module_name` (`module_name`), " +
                                            "	INDEX `index_method_name` (`method_name`), " +
                                            "	INDEX `index_unixtime` (`unixtime`) " +
                                            ") " +
                                            "COLLATE='utf8_general_ci' " +
                                            "ENGINE=InnoDB;";
    }
}
