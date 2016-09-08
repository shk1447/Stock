using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataIntegrationService
{
    class QueryDefine
    {
        public const string stocklist = "SELECT sourcedata, createdtime" +
                                        " FROM (" +
                                        "    SELECT COLUMN_GET(`sourcedata`, 'ticker' as char) as ticker, COLUMN_JSON(`sourcedata`) as sourcedata, UNIX_TIMESTAMP(UnixTimeStamp) as createdtime" +
                                        "    FROM sourcedata" +
                                        "    WHERE source = 'stocklist') as result" +
                                        " GROUP BY ticker ASC;";

        public const string currentStockInfo = "SELECT *" +
                                               " FROM (" +
                                               " SELECT COLUMN_GET(`sourcedata`, 'ticker' as char) as ticker, COLUMN_JSON(`sourcedata`) as sourcedata, unixtimestamp as createdtime" +
                                               " FROM sourcedata" +
                                               " WHERE source = 'currentstock' GROUP BY COLUMN_GET(`sourcedata`, 'ticker' as char), unixtimestamp DESC) as result" +
                                               " GROUP BY ticker ASC";

        public const string trixbyday = "DROP TABLE IF EXISTS `cache`;" +
                                        " CREATE TEMPORARY TABLE IF NOT EXISTS `cache`" +
                                        " (" +
                                        " 	`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                                        " 	`source` varchar(50)," +
                                        " 	`quotevolume` varchar(50)," +
                                        " 	`quoteclose` varchar(50)," +
                                        " 	`ema12` decimal(20,2)," +
                                        " 	`temp` decimal(20,2)," +
                                        " 	`quotedate` timestamp(3)," +
                                        " 	INDEX `IDX_temporary` (`quotedate`,`quoteclose`,`temp`,`ema12`)" +
                                        " ) ENGINE=MEMORY" +
                                        " AS SELECT *" +
                                        " FROM (" +
                                        " SELECT source, COLUMN_GET(`SourceData`, 'VOLUME' as char) as `quotevolume`, COLUMN_GET(`SourceData`, 'CLOSE' as char) as `quoteclose`," +
                                        " null as ema12, null as temp, UnixTimeStamp as quotedate" +
                                        " FROM sourcedata" +
                                        " WHERE source ='{ticker}' AND COLUMN_GET(`SourceData`, 'CLOSE' as char) IS NOT NULL" +
                                        " GROUP BY UnixTimeStamp DESC) as result" +
                                        " GROUP BY DATE(quotedate) ASC;" +
                                        " SET @ema_intervals = {trix};" +
                                        " SET @k = 2 / (1 + @ema_intervals);" +
                                        " SET @prev_ema = 0;" +
                                        " update `cache`" +
                                        " 	set" +
                                        " 		temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quoteclose else `cache`.quoteclose * @k + @prev_ema * (1 - @k) end)," +
                                        " 		ema12 = temp, quotedate = quotedate;" +
                                        " update `cache`" +
                                        " 	set" +
                                        " 		temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.ema12 else `cache`.ema12 * @k + @prev_ema * (1 - @k) end)," +
                                        " 		ema12 = temp, quotedate = quotedate;" +
                                        " update `cache`" +
                                        " 	set" +
                                        " 		temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.ema12 else `cache`.ema12 * @k + @prev_ema * (1 - @k) end)," +
                                        " 		ema12 = temp, quotedate = quotedate;" +
                                        " DROP TABLE IF EXISTS `cache_2`;" +
                                        " CREATE TEMPORARY TABLE IF NOT EXISTS `cache_2` ENGINE=MEMORY AS SELECT * FROM `cache`;" +
                                        " SET @signal_intervals = {signal};" +
                                        " SET @k = 2 / (1 + @signal_intervals);" +
                                        " DROP TABLE IF EXISTS `cache_3`;" +
                                        " CREATE TEMPORARY TABLE IF NOT EXISTS `cache_3` (" +
                                        " 	`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                                        " 	`source` varchar(50)," +
                                        " 	`trix` decimal(8,2)," +
                                        " 	`trix_signal` decimal(8,2)," +
                                        " 	`temp` decimal(8,2)," +
                                        " 	`quotedate` timestamp(3)" +
                                        " ) ENGINE=MEMORY AS SELECT source, quotevolume, quoteclose, trix, trix_signal, temp, quotedate " +
                                        " FROM (" +
                                        " SELECT `cache_2`.source, `cache`.quotevolume, `cache`.quoteclose, (`cache_2`.ema12 - `cache`.ema12)/`cache`.ema12 * 10000 as trix," +
                                        " null as trix_signal, (`cache_2`.ema12 - `cache`.ema12)/`cache`.ema12 * 10000 as temp, `cache_2`.quotedate" +
                                        " FROM `cache`, `cache_2`" +
                                        " WHERE `cache`.idx = `cache_2`.idx - 1) as result;" +
                                        " update `cache_3`" +
                                        " 	set" +
                                        " 		trix_signal = @prev_ema := (case when `cache_3`.idx = 1 then `cache_3`.temp else `cache_3`.temp * @k + @prev_ema * (1 - @k) end)," +
                                        " 		temp = @prev_ema, quotedate = quotedate;" +
                                        " DROP TABLE IF EXISTS `cache_4`;" +
                                        " CREATE TEMPORARY TABLE IF NOT EXISTS `cache_4`" +
                                        " SELECT idx, source, quotevolume, quoteclose, trix, trix_signal, trix-trix_signal as catch, quotedate" +
                                        " FROM `cache_3`;" +
                                        " SELECT cur.source, cur.quotevolume, cur.quoteclose, cur.trix, cur.trix_signal, cur.catch, cur.catch - (prev.trix - prev.trix_signal) as catch_signal," +
                                        " UNIX_TIMESTAMP(cur.quotedate) as createdtime" +
                                        " FROM `cache_4` as cur, `cache_3` as prev" +
                                        " WHERE cur.idx - 1 = prev.idx AND UNIX_TIMESTAMP(cur.quotedate) >= {start} AND UNIX_TIMESTAMP(cur.quotedate) <= {end}";

        public const string trixbyweek = "DROP TABLE IF EXISTS `cache`;" +
                                         " CREATE TEMPORARY TABLE IF NOT EXISTS `cache`" +
                                         " (" +
                                         " 	`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                                         " 	`source` varchar(50)," +
                                         " 	`quotevolume` varchar(50),	" +
                                         " 	`quoteclose` varchar(50)," +
                                         " 	`ema12` decimal(20,2)," +
                                         " 	`temp` decimal(20,2)," +
                                         " 	`quotedate` timestamp(3)," +
                                         " 	INDEX `IDX_temporary` (`quotedate`,`quoteclose`,`temp`,`ema12`)" +
                                         " ) ENGINE=MEMORY" +
                                         " AS SELECT * FROM ( SELECT source, quotevolume, quoteclose, ema12, temp, quotedate" +
                                         " FROM (" +
                                         " SELECT source, COLUMN_GET(`SourceData`, 'VOLUME' as char) as `quotevolume`, COLUMN_GET(`SourceData`, 'CLOSE' as char) as `quoteclose`," +
                                         " null as ema12, null as temp, YEAR(UnixTimeStamp) as year,  MONTH(UnixTimeStamp) as month, WEEK(UnixTimeStamp) as week," +
                                         " WEEKDAY(UnixTimeStamp) as weekday, unixtimestamp as quotedate" +
                                         " FROM sourcedata" +
                                         " WHERE source ='{ticker}' AND COLUMN_GET(`SourceData`, 'CLOSE' as char) IS NOT NULL" +
                                         " group by unixtimestamp desc) as result" +
                                         " group by `year`, `month`, `week`) as test" +
                                         " order by quotedate ASC;" +
                                         " SET @ema_intervals = {trix};" +
                                         " SET @k = 2 / (1 + @ema_intervals);" +
                                         " SET @prev_ema = 0;" +
                                         " update `cache`" +
                                         " 	set" +
                                         " 		temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quoteclose else `cache`.quoteclose * @k + @prev_ema * (1 - @k) end)," +
                                         " 		ema12 = temp, quotedate = quotedate;" +
                                         " update `cache`" +
                                         " 	set" +
                                         " 		temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.ema12 else `cache`.ema12 * @k + @prev_ema * (1 - @k) end)," +
                                         " 		ema12 = temp, quotedate = quotedate;" +
                                         " update `cache`" +
                                         " 	set" +
                                         " 		temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.ema12 else `cache`.ema12 * @k + @prev_ema * (1 - @k) end)," +
                                         " 		ema12 = temp, quotedate = quotedate;" +
                                         " DROP TABLE IF EXISTS `cache_2`;" +
                                         " CREATE TEMPORARY TABLE IF NOT EXISTS `cache_2` ENGINE=MEMORY AS SELECT * FROM `cache`;" +
                                         " SET @signal_intervals = {signal};" +
                                         " SET @k = 2 / (1 + @signal_intervals);" +
                                         " DROP TABLE IF EXISTS `cache_3`;" +
                                         " CREATE TEMPORARY TABLE IF NOT EXISTS `cache_3` (" +
                                         " 	`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                                         " 	`source` varchar(50)," +
                                         " 	`trix` decimal(8,2)," +
                                         " 	`trix_signal` decimal(8,2)," +
                                         " 	`temp` decimal(8,2)," +
                                         " 	`quotedate` timestamp(3)" +
                                         " ) ENGINE=MEMORY AS SELECT source, quotevolume, quoteclose, trix, trix_signal, temp, quotedate " +
                                         " FROM (" +
                                         " SELECT `cache_2`.source, `cache`.quotevolume, `cache`.quoteclose, (`cache_2`.ema12 - `cache`.ema12)/`cache`.ema12 * 10000 as trix," +
                                         " null as trix_signal, (`cache_2`.ema12 - `cache`.ema12)/`cache`.ema12 * 10000 as temp, `cache_2`.quotedate" +
                                         " FROM `cache`, `cache_2`" +
                                         " WHERE `cache`.idx = `cache_2`.idx - 1) as result;" +
                                         " update `cache_3`" +
                                         " 	set" +
                                         " 		trix_signal = @prev_ema := (case when `cache_3`.idx = 1 then `cache_3`.temp else `cache_3`.temp * @k + @prev_ema * (1 - @k) end)," +
                                         " 		temp = @prev_ema, quotedate = quotedate;" +
                                         " DROP TABLE IF EXISTS `cache_4`;" +
                                         " CREATE TEMPORARY TABLE IF NOT EXISTS `cache_4`" +
                                         " SELECT idx, source, quotevolume, quoteclose, trix, trix_signal, trix-trix_signal as catch, quotedate" +
                                         " FROM `cache_3`;" +
                                         " SELECT cur.source, cur.quotevolume, cur.quoteclose, cur.trix, cur.trix_signal, cur.catch," + 
                                         " cur.catch - (prev.trix - prev.trix_signal) as catch_signal, UNIX_TIMESTAMP(cur.quotedate) as createdtime" +
                                         " FROM `cache_4` as cur, `cache_3` as prev" +
                                         " WHERE cur.idx - 1 = prev.idx AND UNIX_TIMESTAMP(cur.quotedate) >= {start} AND UNIX_TIMESTAMP(cur.quotedate) <= {end}";

        public const string movingavg = "DROP TABLE IF EXISTS `cache`;" +
                                        "        CREATE TEMPORARY TABLE IF NOT EXISTS `cache`" +
                                        "        (" +
                                        "            `idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                                        "            `source` varchar(50)," +
                                        "            `quotevolume` varchar(50)," +
                                        "            `quoteclose` varchar(50)," +
                                        "            `quotehigh` varchar(50)," +
                                        "            `quotelow` varchar(50)," +
                                        "            `ema5` decimal(20,2)," +
                                        "            `ema20` decimal(20,2)," +
                                        "            `ema60` decimal(20,2)," +
                                        "            `ema120` decimal(20,2)," +
                                        "            `emav5` decimal(20,2)," +
                                        "            `emav20` decimal(20,2)," +
                                        "            `emav60` decimal(20,2)," +
                                        "            `emav120` decimal(20,2)," +
                                        "            `temp` decimal(20,2)," +
                                        "            `quotedate` timestamp(3)," +
                                        "            INDEX `IDX_temporary` (`quotedate`,`quoteclose`,`temp`)" +
                                        "        ) ENGINE=MEMORY" +
                                        "        AS SELECT *" +
                                        "        FROM (" +
                                        "            SELECT source, COLUMN_GET(`SourceData`, 'VOLUME' as char) as `quotevolume`, COLUMN_GET(`SourceData`, 'CLOSE' as char) as `quoteclose`," +
                                        "            UnixTimeStamp as quotedate, COLUMN_GET(`SourceData`, 'HIGH' as char) as `quotehigh`, COLUMN_GET(`SourceData`, 'LOW' as char) as `quotelow`" +
                                        "        FROM sourcedata" +
                                        "        WHERE source ='{source}' AND COLUMN_GET(`SourceData`, 'CLOSE' as char) IS NOT NULL" +
                                        "        GROUP BY UnixTimeStamp DESC) as result" +
                                        "        GROUP BY DATE(quotedate) ASC;" +
                                        "        SET @ema_intervals = 5;" +
                                        "        SET @k = 2 / (1 + @ema_intervals);" +
                                        "        SET @prev_ema = 0;" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quoteclose else `cache`.quoteclose * @k + @prev_ema * (1 - @k) end)," +
                                        "        ema5 = temp, quotedate = quotedate;" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quotevolume else `cache`.quotevolume * @k + @prev_ema * (1 - @k) end)," +
                                        "        emav5 = temp, quotedate = quotedate;" +
                                        "        SET @ema_intervals = 20;" +
                                        "        SET @k = 2 / (1 + @ema_intervals);" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quoteclose else `cache`.quoteclose * @k + @prev_ema * (1 - @k) end)," +
                                        "        ema20 = temp, quotedate = quotedate;" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quotevolume else `cache`.quotevolume * @k + @prev_ema * (1 - @k) end)," +
                                        "        emav20 = temp, quotedate = quotedate;" +
                                        "        SET @ema_intervals = 60;" +
                                        "        SET @k = 2 / (1 + @ema_intervals);" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quoteclose else `cache`.quoteclose * @k + @prev_ema * (1 - @k) end)," +
                                        "        ema60 = temp, quotedate = quotedate;" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quotevolume else `cache`.quotevolume * @k + @prev_ema * (1 - @k) end)," +
                                        "        emav60 = temp, quotedate = quotedate;" +
                                        "        SET @ema_intervals = 120;" +
                                        "        SET @k = 2 / (1 + @ema_intervals);" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quoteclose else `cache`.quoteclose * @k + @prev_ema * (1 - @k) end)," +
                                        "        ema120 = temp, quotedate = quotedate;" +
                                        "        update `cache`" +
                                        "        set" +
                                        "        temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.quotevolume else `cache`.quotevolume * @k + @prev_ema * (1 - @k) end)," +
                                        "        emav120 = temp, quotedate = quotedate;" +
                                        "        SELECT quoteclose, quotehigh, quotelow, ema5, ema20, ema60, ema120, quotevolume, emav5, emav20, emav60, emav120, UNIX_TIMESTAMP(quotedate) as createdtime" +
                                        "        FROM `cache` WHERE UNIX_TIMESTAMP(quotedate) >= {start} AND UNIX_TIMESTAMP(quotedate) <= {end}";

        public const string createPastTable = "CREATE TABLE IF NOT EXISTS `{tableName}` (" +
                                                    " `idx` INT(11) NOT NULL AUTO_INCREMENT," +
                                                    " `source` VARCHAR(50) NULL DEFAULT NULL," +
                                                    " `rawdata` BLOB NULL," +
                                                    " `unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)," +
                                                    " PRIMARY KEY (`idx`)," +
                                                    " INDEX `idx_Columns` (`source`, `unixtime`)" +
                                                " )" +
                                                " COLLATE='utf8_general_ci'" +
                                                " ENGINE=InnoDB;";

        public const string createCurrentTable = "CREATE TABLE IF NOT EXISTS `{tableName}` (" +
                                                    " `idx` INT(11) NOT NULL AUTO_INCREMENT," +
                                                    " `source` VARCHAR(50) NULL DEFAULT NULL," +
                                                    " `rawdata` BLOB NULL," +
                                                    " `unixtime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)," +
                                                    " PRIMARY KEY (`idx`)," +
                                                    " UNIQUE INDEX `unique_columns` (`source`)," +
                                                    " INDEX `idx_columns` (`unixtime`)" +
                                                " )" +
                                                " COLLATE='utf8_general_ci'" +
                                                " ENGINE=InnoDB;";
        
    }
}
