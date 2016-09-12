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
                                                    " INDEX `idx_Columns` (`category`, `unixtime`)" +
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

        public const string getSourceInformation = "SELECT TABLE_NAME FROM information_schema.`TABLES` WHERE TABLE_SCHEMA = 'datasourcebase' AND TABLE_NAME like 'current_%'";

        public const string getStructureInformation = "SELECT '{source}' as `source`, category, COLUMN_LIST(rawdata) as `fields` " +
                                                      "FROM current_{source} " +
                                                      "GROUP BY category ";
    }
}
