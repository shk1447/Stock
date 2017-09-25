using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Connector
{
    public class MariaQueryDefine
    {
        public const string PlaybackQuery = "SET @@group_concat_max_len = 99999999999999;" + 
                                            "SELECT GROUP_CONCAT(category) as categories, CONCAT('[',GROUP_CONCAT(column_json(rawdata)),']') as data_array," +
                                            " UNIX_TIMESTAMP(unixtime) as data_time" +
                                            " FROM past_stock" +
                                            " WHERE category IN ({categories})" +
                                            " GROUP BY unixtime ASC";

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

        public const string GetSchema = "SET @@group_concat_max_len = 9999999999; SELECT REPLACE(CAST(COLUMN_LIST(rawdata) as char),'`','') as column_list FROM fields_{source}";

        public const string GetAnalysis = "DROP TABLE IF EXISTS `{category}_temp`;  CREATE TEMPORARY TABLE IF NOT EXISTS `{category}_temp`  (`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,  `category` varchar(50),  `거래량` varchar(50),  `종가` varchar(50), `시가` varchar(50), `저가` varchar(50), `고가` varchar(50), `단기거래량` decimal(20,2),  `장기거래량` decimal(20,2),  `생명선` decimal(20,2),  `temp` decimal(20,2),  `temp2` decimal(20,2),  `temp3` decimal(20,2),  `unixtime` timestamp(3), INDEX `IDX_temporary` (`unixtime`)) ENGINE=MEMORY  AS SELECT result02.idx, {sampling}(result01.종가) as `종가`, {sampling}(result01.시가) as `시가`, {sampling}(result01.저가) as `저가`, {sampling}(result01.고가) as `고가`, SUM(result01.거래량) as `거래량`, result01.category, result01.종가 - result02.종가 as Gain, CAST(NULL as DOUBLE) as AvgGain, CAST(NULL as DOUBLE) as AvgLoss, result01.unixtime  FROM ( SELECT @rownum:=@rownum+1 as idx, category, 종가,시가,저가,고가, 거래량, unixtime FROM ( SELECT category, COLUMN_GET(rawdata, '종가' as double) as `종가`, COLUMN_GET(rawdata, '시가' as double) as `시가`, COLUMN_GET(rawdata, '저가' as double) as `저가`, COLUMN_GET(rawdata, '고가' as double) as `고가`, COLUMN_GET(rawdata, '거래량' as double) as `거래량`, unixtime  FROM past_stock WHERE category = '{category}' AND (@rownum:=0)=0 {time_range} GROUP BY DATE(unixtime)) temp01 ORDER BY unixtime ASC) as result01,  ( SELECT @rownum:=@rownum+1 as idx, category, 종가, unixtime FROM ( SELECT category, COLUMN_GET(rawdata, '종가' as double) as `종가`, unixtime  FROM past_stock  WHERE category = '{category}' AND (@rownum:=0)=0 {time_range} GROUP BY DATE(unixtime)) as temp02 ORDER BY unixtime ASC) as result02  WHERE result01.idx - 1 = result02.idx  {sampling_query};    DROP TABLE IF EXISTS `start_{category}_temp`;  CREATE TEMPORARY TABLE IF NOT EXISTS `start_{category}_temp`  ENGINE=MEMORY  AS SELECT category, SUM(CASE WHEN Gain >= 0 THEN Gain ELSE 0 END) AS start_gain_sum, SUM(CASE WHEN Gain < 0 THEN ABS(Gain) ELSE 0 END) AS start_loss_sum FROM {category}_temp WHERE idx <= 14 GROUP BY category;  SET @avg_gain = 0;  SET @avg_loss = 0;  UPDATE {category}_temp,start_{category}_temp  SET AvgGain = @avg_gain := if(idx = 14, start_{category}_temp.start_gain_sum, if(idx > 14, CAST(@avg_gain AS DOUBLE) * 13 + if(Gain >= 0, Gain, 0), 0))/14, AvgLoss = @avg_loss := if(idx = 14, start_{category}_temp.start_loss_sum, if(idx > 14, CAST(@avg_loss AS DOUBLE) * 13 + if(Gain < 0, abs(Gain), 0), 0))/14, unixtime = unixtime  WHERE {category}_temp.category = start_{category}_temp.category;    SET @ema_intervals = {short_day};  SET @k = 2 / (1 + @ema_intervals);  SET @prev_ema = 0;  UPDATE `{category}_temp`  SET temp = @prev_ema := (case when `{category}_temp`.idx = 1 then `{category}_temp`.`거래량` else `{category}_temp`.`거래량` * @k + @prev_ema * (1 - @k) end),  `단기거래량` = temp, `unixtime` = `unixtime`;  SET @ema_intervals = {long_day};  SET @k = 2 / (1 + @ema_intervals);  SET @prev_ema = 0;  UPDATE `{category}_temp`  SET temp2 = @prev_ema := (case when `{category}_temp`.idx = 1 then `{category}_temp`.`거래량` else `{category}_temp`.`거래량` * @k + @prev_ema * (1 - @k) end), `장기거래량` = temp2, `unixtime` = `unixtime`;  SET @ema_intervals = 20;SET @k = 2 / (1 + @ema_intervals);  SET @prev_ema = 0;UPDATE `{category}_temp` SET temp3 = @prev_ema := (case when `{category}_temp`.idx = 1 then `{category}_temp`.`종가` else `{category}_temp`.`종가` * @k + @prev_ema * (1 - @k) end), `생명선` = temp3, `unixtime` = `unixtime`;      SELECT idx, category, UNIX_TIMESTAMP(unixtime) as `unixtime`, 종가,시가,저가,고가, 거래량, Gain, AvgGain, AvgLoss, AvgGain / AvgLoss as RS, 100 - (100 / (1 + AvgGain / AvgLoss)) as RSI, (`단기거래량` - `장기거래량`) / `단기거래량` * 100 as `VOLUME_OSCILLATOR`, 생명선  FROM {category}_temp ORDER BY unixtime ASC;";

        //public const string GetAnalysis2 = "DROP TABLE IF EXISTS `{category}_temp`;  CREATE TEMPORARY TABLE IF NOT EXISTS `{category}_temp`  (`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,  `category` varchar(50),  `거래량` varchar(50),  `종가` varchar(50),  `단기거래량` decimal(20,2),  `장기거래량` decimal(20,2),  `생명선` decimal(20,2),  `temp` decimal(20,2),  `temp2` decimal(20,2),  `temp3` decimal(20,2),  `unixtime` timestamp(3), INDEX `IDX_temporary` (`unixtime`)) ENGINE=MEMORY  AS SELECT result02.idx, {sampling}(result01.종가) as `종가`,result01.시가, result01.고가, result01.저가, SUM(result01.거래량), result01.category, result01.종가 - result02.종가 as Gain, CAST(NULL as DOUBLE) as AvgGain, CAST(NULL as DOUBLE) as AvgLoss, result01.unixtime  FROM ( SELECT @rownum:=@rownum+1 as idx, category, 저가, 고가, 시가, 종가, 거래량, unixtime FROM ( SELECT category, COLUMN_GET(rawdata, '종가' as double) as `종가`, COLUMN_GET(rawdata, '고가' as double) as `고가`, COLUMN_GET(rawdata, '저가' as double) as `저가`, COLUMN_GET(rawdata, '시가' as double) as `시가`, COLUMN_GET(rawdata, '거래량' as double) as `거래량`, unixtime  FROM past_stock WHERE category = '{category}' AND (@rownum:=0)=0 {time_range} GROUP BY DATE(unixtime)) temp01 ORDER BY unixtime ASC) as result01,  ( SELECT @rownum:=@rownum+1 as idx, category, 종가, unixtime FROM ( SELECT category, COLUMN_GET(rawdata, '종가' as double) as `종가`, unixtime  FROM past_stock  WHERE category = '{category}' AND (@rownum:=0)=0 {time_range} GROUP BY DATE(unixtime)) as temp02 ORDER BY unixtime ASC) as result02  WHERE result01.idx - 1 = result02.idx  {sampling_query};    DROP TABLE IF EXISTS `start_{category}_temp`;  CREATE TEMPORARY TABLE IF NOT EXISTS `start_{category}_temp`  ENGINE=MEMORY  AS SELECT category, SUM(CASE WHEN Gain >= 0 THEN Gain ELSE 0 END) AS start_gain_sum, SUM(CASE WHEN Gain < 0 THEN ABS(Gain) ELSE 0 END) AS start_loss_sum FROM {category}_temp WHERE idx <= 14 GROUP BY category;  SET @avg_gain = 0;  SET @avg_loss = 0;  UPDATE {category}_temp,start_{category}_temp  SET AvgGain = @avg_gain := if(idx = 14, start_{category}_temp.start_gain_sum, if(idx > 14, CAST(@avg_gain AS DOUBLE) * 13 + if(Gain >= 0, Gain, 0), 0))/14, AvgLoss = @avg_loss := if(idx = 14, start_{category}_temp.start_loss_sum, if(idx > 14, CAST(@avg_loss AS DOUBLE) * 13 + if(Gain < 0, abs(Gain), 0), 0))/14, unixtime = unixtime  WHERE {category}_temp.category = start_{category}_temp.category;    SET @ema_intervals = {short_day};  SET @k = 2 / (1 + @ema_intervals);  SET @prev_ema = 0;  UPDATE `{category}_temp`  SET temp = @prev_ema := (case when `{category}_temp`.idx = 1 then `{category}_temp`.`거래량` else `{category}_temp`.`거래량` * @k + @prev_ema * (1 - @k) end),  `단기거래량` = temp, `unixtime` = `unixtime`;  SET @ema_intervals = {long_day};  SET @k = 2 / (1 + @ema_intervals);  SET @prev_ema = 0;  UPDATE `{category}_temp`  SET temp2 = @prev_ema := (case when `{category}_temp`.idx = 1 then `{category}_temp`.`거래량` else `{category}_temp`.`거래량` * @k + @prev_ema * (1 - @k) end), `장기거래량` = temp2, `unixtime` = `unixtime`;  SET @ema_intervals = 20;SET @k = 2 / (1 + @ema_intervals);  SET @prev_ema = 0;UPDATE `{category}_temp` SET temp3 = @prev_ema := (case when `{category}_temp`.idx = 1 then `{category}_temp`.`종가` else `{category}_temp`.`종가` * @k + @prev_ema * (1 - @k) end), `생명선` = temp3, `unixtime` = `unixtime`;      SELECT idx, category,  candle_direct, case when candle_direct = 'plus' then (candle_weight+저가_weight) / (candle_weight + 저가_weight + 고가_weight) when candle_direct = 'minus' then 저가_weight / (candle_weight + 저가_weight + 고가_weight) else 저가_weight / (고가_weight + 저가_weight) end * 100 as `BUY_WEIGHT`,  case when candle_direct = 'minus' then (candle_weight+고가_weight) / (candle_weight + 고가_weight + 저가_weight) when candle_direct = 'plus' then 고가_weight / (candle_weight + 고가_weight + 저가_weight) else 고가_weight / (고가_weight + 저가_weight) end * 100 as `CELL_WEIGHT`, UNIX_TIMESTAMP(DATE(unixtime)) as `unixtime`, 종가, Gain, AvgGain, AvgLoss, AvgGain / AvgLoss as RS, 100 - (100 / (1 + AvgGain / AvgLoss)) as RSI, (`단기거래량` - `장기거래량`) / `단기거래량` * 100 as `VOLUME_OSCILLATOR`, 생명선 FROM ( SELECT *, case when `시가` = 0 then '거래정지' when `시가` = `종가` then 'doji' when `시가` > `종가` then 'minus' else 'plus' end as `candle_direct`, case when `시가` = 0 then 0 else ABS(`시가` - `종가`) end as `candle_weight`, case when `시가` = 0 then 0 when `시가` > `종가` then `고가` - `시가` else `고가` - `종가` end as `고가_weight`, case when `시가` = 0 then 0 when `시가` < `종가` then `시가` - `저가` else `종가` -`저가` end as `저가_weight` FROM 079170_temp) as complete ORDER BY unixtime ASC;";

        //public const string GetVolumeOscillator = "DROP TABLE IF EXISTS `temp_volume`; CREATE TEMPORARY TABLE IF NOT EXISTS `temp_volume`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`전일비율` varchar(50),`거래량` varchar(50), `종가` varchar(50), `단기거래량` decimal(20,2),`장기거래량` decimal(20,2),`생명선` decimal(20,2),`temp` decimal(20,2),`temp2` decimal(20,2),`temp3` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, '전일비율' as char) as `전일비율`, SUM(COLUMN_GET(`rawdata`, '거래량' as char)) as `거래량`, COLUMN_GET(`rawdata`, '종가' as char) as `종가`, unixtime as `날짜` FROM past_stock WHERE category ='{category}' AND COLUMN_GET(`rawdata`, '거래량' as char) IS NOT NULL GROUP BY unixtime ASC) as result {sampling_query}; SET @ema_intervals = {short_day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `temp_volume` SET temp = @prev_ema := (case when `temp_volume`.idx = 1 then `temp_volume`.`거래량` else `temp_volume`.`거래량` * @k + @prev_ema * (1 - @k) end), `단기거래량` = temp, `날짜` = `날짜`; SET @ema_intervals = {long_day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `temp_volume` SET temp2 = @prev_ema := (case when `temp_volume`.idx = 1 then `temp_volume`.`거래량` else `temp_volume`.`거래량` * @k + @prev_ema * (1 - @k) end), `장기거래량` = temp2, `날짜` = `날짜`;SET @ema_intervals = 20;SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `temp_volume` SET temp3 = @prev_ema := (case when `temp_volume`.idx = 1 then `temp_volume`.`종가` else `temp_volume`.`종가` * @k + @prev_ema * (1 - @k) end), `생명선` = temp3, `날짜` = `날짜`; SELECT `전일비율` as `전일비율`, (`단기거래량` - `장기거래량`) / `단기거래량` * 100 as `VOLUME_OSCILLATOR`, 생명선,  UNIX_TIMESTAMP(DATE(`날짜`)) as `unixtime` FROM `temp_volume`";
        public const string GetRSI = "DROP TABLE IF EXISTS `{category}_collection`; CREATE TEMPORARY TABLE IF NOT EXISTS `{category}_collection` ENGINE=MEMORY AS SELECT result02.idx, result01.종가, result01.category, result01.종가 - result02.종가 as Gain, CAST(NULL as DOUBLE) as AvgGain, CAST(NULL as DOUBLE) as AvgLoss, result01.unixtime FROM ( SELECT @rownum:=@rownum+1 as idx, category, 종가, unixtime FROM ( SELECT category, COLUMN_GET(rawdata, '종가' as double) as `종가`, unixtime FROM past_stock WHERE category = '{category}' AND (@rownum:=0)=0 GROUP BY DATE(unixtime)) temp01 ORDER BY unixtime ASC) as result01, ( SELECT @rownum:=@rownum+1 as idx, category, 종가, unixtime FROM ( SELECT category, COLUMN_GET(rawdata, '종가' as double) as `종가`, unixtime FROM past_stock WHERE category = '{category}' AND (@rownum:=0)=0 GROUP BY DATE(unixtime)) as temp02 ORDER BY unixtime ASC) as result02 WHERE result01.idx - 1 = result02.idx;   DROP TABLE IF EXISTS `start_{category}_collection`; CREATE TEMPORARY TABLE IF NOT EXISTS `start_{category}_collection` ENGINE=MEMORY AS SELECT category, SUM(CASE WHEN Gain >= 0 THEN Gain ELSE 0 END) AS start_gain_sum, SUM(CASE WHEN Gain < 0 THEN ABS(Gain) ELSE 0 END) AS start_loss_sum FROM {category}_collection WHERE idx <= 14 GROUP BY category;  SET @avg_gain = 0; SET @avg_loss = 0;  UPDATE {category}_collection,start_{category}_collection SET AvgGain = @avg_gain := if(idx = 14, start_{category}_collection.start_gain_sum, if(idx > 14, CAST(@avg_gain AS DOUBLE) * 13 + if(Gain >= 0, Gain, 0), 0))/14, AvgLoss = @avg_loss := if(idx = 14, start_{category}_collection.start_loss_sum, if(idx > 14, CAST(@avg_loss AS DOUBLE) * 13 + if(Gain < 0, abs(Gain), 0), 0))/14 WHERE {category}_collection.category = start_{category}_collection.category;  SELECT idx, category, UNIX_TIMESTAMP(DATE(unixtime)) as `unixtime`, 종가, 100 - (100 / (1 + AvgGain / AvgLoss)) as RSI FROM {category}_collection";
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
