using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using Helper;
using Model.Common;
using Model.Response;
using SourceModuleManager;

namespace DataIntegrationServiceLogic
{
    public class CollectionLogic
    {
        private const string TableName = "data_collection";

        public string Schema()
        {
            var fields = new List<FieldSchema>();

            //fields.Add(new FieldSchema("COLLECTION NAME", "name", "Text", 0, true).AddAttributes("maxlength", 10));
            //var moduleSelect = new FieldSchema("MODULE NAME", "module_name", "Select", 0, true);
            //foreach (var module in ModuleManager.Instance.SourceModules)
            //{
            //    moduleSelect.AddOptions(new JsonDictionary().Add("text", module.Key).Add("value", module.Key));
            //    foreach (var method in module.Value.GetConfig())
            //    {
                    
            //    }
            //}
            //fields.Add(new FieldSchema("MEMBER NAME", "member_name", "Select", 1, true));
            //fields.Add(new FieldSchema("PRIVILEGE", "privilege", "MultiSelect", 2).AddOptions(
            //    new JsonDictionary().Add("text", "MANAGER").Add("value", "manager")).AddOptions(new JsonDictionary().Add("text", "USER").Add("value", "user")));
            //fields.Add(new FieldSchema("E-MAIL", "email", "Text", 3));
            //fields.Add(new FieldSchema("PHONE NUMBER", "phone_number", "Text", 4));

            return DataConverter.Serializer<List<FieldSchema>>(fields);
        }

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
