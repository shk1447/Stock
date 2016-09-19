{
  "Name": "이동평균선",
  "Source": "finance",
  "Categories": [
    "000020"
  ],
  "CollectedAt": "날짜",
  "AnalysisQuery": "DROP TABLE IF EXISTS `cache`; CREATE TEMPORARY TABLE IF NOT EXISTS `cache`(`idx` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,`category` varchar(50),`종가` varchar(50),`{day}일_이동평균` decimal(20,2),`temp` decimal(20,2),`날짜` timestamp(3), INDEX `IDX_temporary` (`날짜`,`종가`,`temp`)) ENGINE=MEMORY AS SELECT * FROM (SELECT category, COLUMN_GET(`rawdata`, '종가' as char) as `종가`, unixtime as `날짜` FROM past_finance WHERE category ='{category}' AND COLUMN_GET(`rawdata`, '종가' as char) IS NOT NULL GROUP BY unixtime DESC) as result GROUP BY DATE(`날짜`) ASC;SET @ema_intervals = {day};SET @k = 2 / (1 + @ema_intervals);SET @prev_ema = 0;UPDATE `cache` SET temp = @prev_ema := (case when `cache`.idx = 1 then `cache`.`종가` else `cache`.`종가` * @k + @prev_ema * (1 - @k) end), `{day}일_이동평균` = temp, `날짜` = `날짜`; SELECT `{day}일_이동평균`, UNIX_TIMESTAMP(`날짜`) as `날짜` FROM `cache`;",
  "Options": {
    "day": 5
  },
  "ScheduleTime": ""
}