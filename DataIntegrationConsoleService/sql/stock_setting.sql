-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.1.10-MariaDB-log - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.1.0.4867
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 테이블 datasourcebase의 구조를 덤프합니다. data_analysis
CREATE TABLE IF NOT EXISTS `data_analysis` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `target_source` varchar(50) DEFAULT NULL,
  `analysis_query` text,
  `action_type` varchar(50) DEFAULT NULL,
  `options` blob,
  `schedule` blob,
  `status` varchar(50) DEFAULT 'stop',
  `unixtime` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`idx`),
  UNIQUE KEY `unique_columns` (`name`),
  KEY `index_columns` (`target_source`,`unixtime`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Dumping data for table datasourcebase.data_analysis: ~10 rows (대략적)
/*!40000 ALTER TABLE `data_analysis` DISABLE KEYS */;
INSERT INTO `data_analysis` (`idx`, `name`, `target_source`, `analysis_query`, `action_type`, `options`, `schedule`, `status`, `unixtime`) VALUES
	(2, 'AVG_DAY', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`{day}일_이동평균` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`,`종가`,`temp`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, \'종가\' as char) as `종가`, unixtime as `날짜` FROM past_finance WHERE category =\'{category}\' AND COLUMN_GET(`rawdata`, \'종가\' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC;SET @ema_intervals = {day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end), `{day}일_이동평균` = temp, `날짜` = `날짜`; SELECT `{day}일_이동평균`, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}` ORDER BY `날짜` DESC', 'once', _binary 0x0401000300000003006461792135, _binary 0x0404001800000003000300630008003F0010001801656E647374617274696E74657276616C7765656B646179732131313A33362131313A3336213130303004010001000000030030214D4F4E, 'stop', '2016-11-03 11:44:07.023'),
	(3, 'MACD_DAY', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`;CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`ema_short` decimal(20,2),`ema_long` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3),INDEX `IDX_temporary` (`날짜`,`종가`,`temp`,`ema_short`,`ema_long`)) ENGINE=MEMORY AS SELECT * FROM ( SELECT category, COLUMN_GET(`rawdata`, \'종가\' as char) as `종가`, null as ema_short, null as ema_long, null as temp, unixtime as `날짜` FROM past_finance WHERE category =\'{category}\' AND COLUMN_GET(`rawdata`, \'종가\' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC; SET @ema_intervals = {short_day}; SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end),ema_short = temp, `날짜` = `날짜`;SET @ema_intervals = {long_day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end),ema_long = temp, `날짜` = `날짜`;DROP TABLE IF EXISTS `{analysis_name}2`;CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}2`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`macd` decimal(20,2),`macd_signal` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3)) ENGINE=MEMORY AS SELECT category, ema_short - ema_long as macd, null as macd_signal, null as temp, `날짜` FROM `{analysis_name}`;SET @ema_intervals = {signal_day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}2` SET temp = @prev_ema := (case when `{analysis_name}2`.idx = 1 then `{analysis_name}2`.macd else `{analysis_name}2`.macd * @k + @prev_ema * (1 - @k) end),macd_signal = temp, `날짜` = `날짜`;SELECT macd as macd_day_{short_day}_{long_day}_{signal_day}, macd_signal as macd_signal_day_{short_day}_{long_day}_{signal_day}, macd - macd_signal as macd_oscillator_day_{short_day}_{long_day}_{signal_day}, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}2` ORDER BY `날짜` DESC', 'once', _binary 0x0403001B000000030008003300110053006C6F6E675F64617973686F72745F6461797369676E616C5F64617921343521322134, NULL, 'stop', '2016-10-21 17:02:08.917'),
	(4, 'TRIX_DAY', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`;CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`ema` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3),INDEX `IDX_temporary` (`날짜`,`종가`,`temp`,`ema`)) ENGINE=MEMORY AS SELECT * FROM ( SELECT category, COLUMN_GET(`rawdata`, \'종가\' as char) as `종가`, null as ema, null as temp, unixtime as `날짜` FROM past_finance WHERE category =\'{category}\' AND COLUMN_GET(`rawdata`, \'종가\' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(날짜) ASC; SET @ema_intervals = {trix_day}; SET @k = 2 / (1 + @ema_intervals); SET @prev_ema = 0; UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.종가 else `{analysis_name}`.종가 * @k + @prev_ema * (1 - @k) end), ema = temp, 날짜 = 날짜; UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.ema else `{analysis_name}`.ema * @k + @prev_ema * (1 - @k) end), ema = temp, 날짜 = 날짜; UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.ema else `{analysis_name}`.ema * @k + @prev_ema * (1 - @k) end), ema = temp, 날짜 = 날짜; DROP TABLE IF EXISTS `{analysis_name}_2`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}_2` ENGINE=MEMORY AS SELECT * FROM `{analysis_name}`; SET @signal_intervals = {signal_day}; SET @k = 2 / (1 + @signal_intervals); DROP TABLE IF EXISTS `{analysis_name}_3`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}_3` ( `idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, `category` varchar(50), `trix` decimal(8,2), `trix_signal` decimal(8,2), `temp` decimal(8,2), `날짜` timestamp(3) ) ENGINE=MEMORY AS SELECT category, 종가, trix, trix_signal, temp, 날짜 FROM ( SELECT `{analysis_name}_2`.category, `{analysis_name}`.종가, (`{analysis_name}_2`.ema - `{analysis_name}`.ema)/`{analysis_name}`.ema * 10000 as trix, null as trix_signal, (`{analysis_name}_2`.ema - `{analysis_name}`.ema)/`{analysis_name}`.ema * 10000 as temp, `{analysis_name}_2`.날짜 FROM `{analysis_name}`, `{analysis_name}_2` WHERE `{analysis_name}`.idx = `{analysis_name}_2`.idx - 1) as result; UPDATE `{analysis_name}_3` SET trix_signal = @prev_ema := (case when `{analysis_name}_3`.idx = 1 then `{analysis_name}_3`.temp else `{analysis_name}_3`.temp * @k + @prev_ema * (1 - @k) end), temp = @prev_ema, 날짜 = 날짜; SELECT trix as trix_day_{trix_day}_{signal_day}, trix_signal as trix_signal_day_{trix_day}_{signal_day}, trix-trix_signal as trix_oscillator_day_{trix_day}_{signal_day}, UNIX_TIMESTAMP(날짜) as `날짜` FROM `{analysis_name}_3` ORDER BY `날짜` DESC', 'once', _binary 0x04020012000000030008003300747269785F6461797369676E616C5F6461792132352139, NULL, 'stop', '2016-10-21 17:03:18.813'),
	(5, 'AVG_WEEK', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`{week}주_이동평균` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`,`종가`,`temp`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category,column_get(`rawdata`, \'종가\' AS char) AS `종가`,NULL AS ema_short,NULL AS ema_long,NULL AS temp, TO_DAYS(unixtime) - WEEKDAY(unixtime) AS \'days\', WEEKDAY(unixtime) AS `weekday`, unixtime AS `날짜` FROM     past_finance WHERE    category =\'{category}\'AND      column_get(`rawdata`, \'종가\' AS char) IS NOT NULL GROUP BY `날짜` DESC) AS result GROUP BY `days` ASC;SET @ema_intervals = {week};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end), `{week}주_이동평균` = temp, `날짜` = `날짜`; SELECT `{week}주_이동평균`, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}` ORDER BY `날짜` DESC', 'once', _binary 0x0401000400000003007765656B213230, NULL, 'stop', '2016-10-21 17:04:20.068'),
	(6, 'MACD_WEEK', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`;CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`ema_short` decimal(20,2),`ema_long` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3),INDEX `IDX_temporary` (`날짜`,`종가`,`temp`,`ema_short`,`ema_long`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category,column_get(`rawdata`, \'종가\' AS char) AS `종가`,NULL AS ema_short,NULL AS ema_long,NULL AS temp, TO_DAYS(unixtime) - WEEKDAY(unixtime) AS \'days\', WEEKDAY(unixtime) AS `weekday`, unixtime AS `날짜` FROM     past_finance WHERE    category =\'{category}\'AND      column_get(`rawdata`, \'종가\' AS char) IS NOT NULL GROUP BY `날짜` DESC) AS result GROUP BY `days` ASC; SET @ema_intervals = {short_week}; SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end),ema_short = temp, `날짜` = `날짜`;SET @ema_intervals = {long_week};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end),ema_long = temp, `날짜` = `날짜`;DROP TABLE IF EXISTS `{analysis_name}2`;CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}2`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`macd` decimal(20,2),`macd_signal` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3)) ENGINE=MEMORY AS SELECT category, ema_short - ema_long as macd, null as macd_signal, null as temp, `날짜` FROM `{analysis_name}`;SET @ema_intervals = {signal_week};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}2` SET temp = @prev_ema := (case when `{analysis_name}2`.idx = 1 then `{analysis_name}2`.macd else `{analysis_name}2`.macd * @k + @prev_ema * (1 - @k) end),macd_signal =temp, `날짜` = `날짜`;SELECT macd as macd_week_{short_week}_{long_week}_{signal_week}, macd_signal as macd_signal_week_{short_week}_{long_week}_{signal_week}, macd - macd_signal as macd_oscillator_week_{short_week}_{long_week}_{signal_week}, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}2` ORDER BY `날짜` DESC', 'once', _binary 0x0403001E000000030009003300130063006C6F6E675F7765656B73686F72745F7765656B7369676E616C5F7765656B213630213132213130, NULL, 'stop', '2016-10-21 17:05:31.916'),
	(7, 'TRIX_WEEK', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`;CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`ema` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3),INDEX `IDX_temporary` (`날짜`,`종가`,`temp`,`ema`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category,column_get(`rawdata`, \'종가\' AS char) AS `종가`,NULL AS ema_short,NULL AS ema_long,NULL AS temp, TO_DAYS(unixtime) - WEEKDAY(unixtime) AS \'days\', WEEKDAY(unixtime) AS `weekday`, unixtime AS `날짜` FROM     past_finance WHERE    category =\'{category}\'AND      column_get(`rawdata`, \'종가\' AS char) IS NOT NULL GROUP BY `날짜` DESC) AS result GROUP BY `days` ASC; SET @ema_intervals = {trix_week}; SET @k = 2 / (1 + @ema_intervals); SET @prev_ema = 0; UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.종가 else `{analysis_name}`.종가 * @k + @prev_ema * (1 - @k) end), ema = temp, 날짜 = 날짜; UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.ema else `{analysis_name}`.ema * @k + @prev_ema * (1 - @k) end), ema = temp, 날짜 = 날짜; UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.ema else `{analysis_name}`.ema * @k + @prev_ema * (1 - @k) end), ema = temp, 날짜 = 날짜; DROP TABLE IF EXISTS `{analysis_name}_2`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}_2` ENGINE=MEMORY AS SELECT * FROM `{analysis_name}`; SET @signal_intervals = {signal_week}; SET @k = 2 / (1 + @signal_intervals); DROP TABLE IF EXISTS `{analysis_name}_3`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}_3` ( `idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, `category` varchar(50), `trix` decimal(8,2), `trix_signal` decimal(8,2), `temp` decimal(8,2), `날짜` timestamp(3) ) ENGINE=MEMORY AS SELECT category, 종가, trix, trix_signal, temp, 날짜 FROM ( SELECT `{analysis_name}_2`.category, `{analysis_name}`.종가, (`{analysis_name}_2`.ema - `{analysis_name}`.ema)/`{analysis_name}`.ema * 10000 as trix, null as trix_signal, (`{analysis_name}_2`.ema - `{analysis_name}`.ema)/`{analysis_name}`.ema * 10000 as temp, `{analysis_name}_2`.날짜 FROM `{analysis_name}`, `{analysis_name}_2` WHERE `{analysis_name}`.idx = `{analysis_name}_2`.idx - 1) as result; UPDATE `{analysis_name}_3` SET trix_signal = @prev_ema := (case when `{analysis_name}_3`.idx = 1 then `{analysis_name}_3`.temp else `{analysis_name}_3`.temp * @k + @prev_ema * (1 - @k) end), temp = @prev_ema, 날짜 = 날짜; SELECT trix as trix_week_{trix_week}_{signal_week}, trix_signal as trix_signal_week_{trix_week}_{signal_week}, trix-trix_signal as trix_oscillator_week_{trix_week}_{signal_week}, UNIX_TIMESTAMP(날짜) as `날짜` FROM `{analysis_name}_3` ORDER BY `날짜` DESC', 'once', _binary 0x04020014000000030009003300747269785F7765656B7369676E616C5F7765656B2131322139, NULL, 'stop', '2016-10-21 17:06:59.684'),
	(8, 'AVG_DAY_5', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`{day}일_이동평균` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`,`종가`,`temp`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, \'종가\' as char) as `종가`, unixtime as `날짜` FROM past_finance WHERE category =\'{category}\' AND COLUMN_GET(`rawdata`, \'종가\' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC;SET @ema_intervals = {day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end), `{day}일_이동평균` = temp, `날짜` = `날짜`; SELECT `{day}일_이동평균`, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}` ORDER BY `날짜` DESC', 'once', _binary 0x0401000300000003006461792135, _binary 0x0404001800000003000300630008003F0010002801656E647374617274696E74657276616C7765656B646179732132303A33352132303A33302131303030300405000500000003000100430002003F0003003F00040003013031323334214D4F4E21545545215745442154485521465249, 'stop', '2016-11-03 11:52:49.003'),
	(10, 'AVG_DAY_20', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`{day}일_이동평균` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`,`종가`,`temp`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, \'종가\' as char) as `종가`, unixtime as `날짜` FROM past_finance WHERE category =\'{category}\' AND COLUMN_GET(`rawdata`, \'종가\' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC;SET @ema_intervals = {day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end), `{day}일_이동평균` = temp, `날짜` = `날짜`; SELECT `{day}일_이동평균`, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}` ORDER BY `날짜` DESC', 'once', _binary 0x040100030000000300646179213230, NULL, 'stop', '2016-11-03 11:53:05.681'),
	(12, 'AVG_DAY_60', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`{day}일_이동평균` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`,`종가`,`temp`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, \'종가\' as char) as `종가`, unixtime as `날짜` FROM past_finance WHERE category =\'{category}\' AND COLUMN_GET(`rawdata`, \'종가\' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC;SET @ema_intervals = {day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end), `{day}일_이동평균` = temp, `날짜` = `날짜`; SELECT `{day}일_이동평균`, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}` ORDER BY `날짜` DESC', 'once', _binary 0x040100030000000300646179213630, NULL, 'stop', '2016-11-03 11:44:16.048'),
	(13, 'AVG_DAY_120', 'finance', 'DROP TABLE IF EXISTS `{analysis_name}`; CREATE TEMPORARY TABLE IF NOT EXISTS `{analysis_name}`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`{day}일_이동평균` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`,`종가`,`temp`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, \'종가\' as char) as `종가`, unixtime as `날짜` FROM past_finance WHERE category =\'{category}\' AND COLUMN_GET(`rawdata`, \'종가\' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC;SET @ema_intervals = {day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `{analysis_name}` SET temp = @prev_ema := (case when `{analysis_name}`.idx = 1 then `{analysis_name}`.`종가` else `{analysis_name}`.`종가` * @k + @prev_ema * (1 - @k) end), `{day}일_이동평균` = temp, `날짜` = `날짜`; SELECT `{day}일_이동평균`, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `{analysis_name}` ORDER BY `날짜` DESC', 'once', _binary 0x04010003000000030064617921313230, NULL, 'stop', '2016-11-03 11:44:23.619');
/*!40000 ALTER TABLE `data_analysis` ENABLE KEYS */;


-- 테이블 datasourcebase의 구조를 덤프합니다. data_collection
CREATE TABLE IF NOT EXISTS `data_collection` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `method_name` varchar(50) DEFAULT NULL,
  `action_type` varchar(50) DEFAULT NULL,
  `options` blob,
  `schedule` blob,
  `status` varchar(50) DEFAULT 'stop',
  `unixtime` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`idx`),
  UNIQUE KEY `unique_columns` (`name`),
  KEY `index_columns` (`module_name`,`method_name`,`unixtime`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table datasourcebase.data_collection: ~3 rows (대략적)
/*!40000 ALTER TABLE `data_collection` DISABLE KEYS */;
INSERT INTO `data_collection` (`idx`, `name`, `module_name`, `method_name`, `action_type`, `options`, `schedule`, `status`, `unixtime`) VALUES
	(1, 'Stock', 'Finance.dll', 'StockInformation', 'once', _binary 0x0402000A000000030004004300646179736D6574686F642131303021686973746F7279, _binary 0x0404001800000003000300630008003F0010003F00656E647374617274696E74657276616C7765656B646179732130323A33352132343A3335210405000500000003000100430002003F0003003F00040003013031323334214D4F4E21545545215745442154485521465249, 'stop', '2016-11-03 09:36:16.561'),
	(2, 'Stock_Real', 'Finance.dll', 'StockInformation', 'schedule', _binary 0x0402000A000000030004002300646179736D6574686F642131217265616C74696D65, _binary 0x0404001800000003000300630008003F0010002801656E647374617274696E74657276616C7765656B646179732131353A33302130393A30302136303030300405000500000003000100430002003F0003003F00040003013031323334214D4F4E21545545215745442154485521465249, 'stop', '2016-11-03 13:55:13.838'),
	(6, 'finance', 'Finance.dll', 'StockInformation', 'once', _binary 0x0402000A000000030004004300646179736D6574686F642131303021686973746F7279, NULL, 'stop', '2016-11-03 13:54:30.405');
/*!40000 ALTER TABLE `data_collection` ENABLE KEYS */;


-- 테이블 datasourcebase의 구조를 덤프합니다. data_view
CREATE TABLE IF NOT EXISTS `data_view` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `view_type` varchar(50) DEFAULT NULL,
  `view_query` text,
  `unixtime` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`idx`),
  UNIQUE KEY `unique_columns` (`name`,`member_id`),
  KEY `index_columns` (`unixtime`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

-- Dumping data for table datasourcebase.data_view: ~7 rows (대략적)
/*!40000 ALTER TABLE `data_view` DISABLE KEYS */;
INSERT INTO `data_view` (`idx`, `member_id`, `name`, `view_type`, `view_query`, `unixtime`) VALUES
	(1, 'admin', '현재 주가', 'current', 'SELECT column_get(`rawdata`, \'종목명\' as char) as `종목명`, column_get(`rawdata`, \'종가\' as int) `종가`,  `unixtime` as `수집시간` FROM current_finance', '2016-11-03 16:35:34.640'),
	(2, 'admin', '실시간 고가', 'current', 'SELECT column_get(`rawdata`, \'종목명\' as char) as `종목명`, column_get(`rawdata`, \'고가\' as char) as `고가` FROM current_finance', '2016-11-03 16:35:37.390'),
	(13, 'admin', '과거 종가', 'past', 'SELECT `종가`,`5일_이동평균`, UNIX_TIMESTAMP(`unixtime`) as unixtime FROM (SELECT AVG(column_get(`rawdata`, \'종가\' as int)) as `종가`, AVG(column_get(`rawdata`, \'5일_이동평균\' as int)) as `5일_이동평균`, `unixtime` FROM past_finance WHERE category=\'000020\' GROUP BY unixtime DESC) as result GROUP BY DATE(unixtime)', '2016-11-03 16:35:41.415'),
	(29, 'admin', '당기순이익/시가총액', 'current', 'SELECT * FROM (SELECT column_get(rawdata, \'종목명\' as char) as `종목명`, column_get(rawdata, \'종가\' as int) as `현재가`, column_get(rawdata, \'당기순이익\' as int) / column_get(rawdata, \'시가총액\' as int) as `수익률`, unixtime FROM current_finance) as result ORDER BY `수익률` DESC', '2016-11-03 16:35:44.086'),
	(30, 'shkim', '주가TOP100', 'current', 'SELECT column_get(rawdata,\'종목명\' as char) as `종목명`, column_get(rawdata,\'종가\' as int) as `종가`, unixtime as `수집시간` FROM current_finance ORDER BY column_get(rawdata,\'종가\' as int) DESC LIMIT 100;', '2016-11-03 10:46:02.573'),
	(34, 'admin', '루멘스(038060)', 'past', 'SELECT column_get(`rawdata`, \'종가\' as int) as `종가`,  column_get(`rawdata`, \'5일_이동평균\' as int) as `5일_이동평균`,UNIX_TIMESTAMP(`unixtime`) as unixtime FROM past_finance WHERE category=\'038060\' ORDER BY unixtime ASC', '2016-11-03 16:35:46.966'),
	(35, 'admin', '루멘스(038060)_일봉', 'past', 'SELECT `종가`,`5일_이동평균`, UNIX_TIMESTAMP(`unixtime`) as unixtime FROM (SELECT AVG(column_get(`rawdata`, \'종가\' as int)) as `종가`, AVG(column_get(`rawdata`, \'5일_이동평균\' as int)) as `5일_이동평균`, `unixtime` FROM past_finance WHERE category=\'038060\' GROUP BY unixtime DESC) as result GROUP BY DATE(unixtime)', '2016-11-03 16:35:49.839');
/*!40000 ALTER TABLE `data_view` ENABLE KEYS */;


-- 테이블 datasourcebase의 구조를 덤프합니다. member
CREATE TABLE IF NOT EXISTS `member` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` varchar(50) DEFAULT NULL,
  `member_name` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `privilege` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `unixtime` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`idx`),
  UNIQUE KEY `unique_columns` (`member_id`),
  KEY `index_columns` (`member_name`,`unixtime`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table datasourcebase.member: ~2 rows (대략적)
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` (`idx`, `member_id`, `member_name`, `password`, `privilege`, `email`, `phone_number`, `unixtime`) VALUES
	(1, 'admin', '김석환', 'soul1087', 'super', 'sukan8822@gmail.com', '01057721447', '2016-11-03 09:50:52.538'),
	(2, 'shkim', '홍길동', 'soul1087', '\0\0\0\0\00!user', 'shk1447@n3n.co.kr', '112', '2016-11-03 10:05:29.134');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;


-- 프로시저 datasourcebase의 구조를 덤프합니다. DynamicQueryExecuter
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `DynamicQueryExecuter`(IN `queryText` LONGTEXT)
BEGIN
	SET @count = 1;
	WHILE SPLIT_TEXT(queryText, ';', @count) != '' DO
		SET @SQLString = SPLIT_TEXT(queryText, ';', @count);
		PREPARE st FROM @SQLString;
		EXECUTE st;
		DEALLOCATE PREPARE st;
	
		SET @count = @count + 1;
	END WHILE;
END//
DELIMITER ;


-- 함수 datasourcebase의 구조를 덤프합니다. SPLIT_TEXT
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `SPLIT_TEXT`(`x` LONGTEXT, `delim` VARCHAR(12), `pos` INT) RETURNS longtext CHARSET utf8
    DETERMINISTIC
RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       CHAR_LENGTH(SUBSTRING_INDEX(x, delim, pos - 1)) + 1),
       delim, '')//
DELIMITER ;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
