using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using Helper;
using Model.Common;
using Model.Response;

namespace DataIntegrationServiceLogic
{
    public class CollectionLogic
    {
        private const string TableName = "data_collection";

        public string GetList()
        {
            var selectedItems = new List<string>() { "name", "module_name", "method_name", "COLUMN_JSON(options) as options", "COLUMN_JSON(schedule) as schedule", "status", "unixtime" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems);
            var res = MariaDBConnector.Instance.GetQuery<Collection>(query);

            return string.Empty;
            //return DataConverter.Serializer<List<GetCollectionModuleRes>>(res); ;
        }

        public string GetStructure()
        {
            return string.Empty;
        }
    }
}
