﻿using System;
using System.Collections.Generic;
using System.Json;
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

            fields.Add(new FieldSchema("COLLECTION NAME", "name", "Text", 0, true).AddAttributes("maxlength", 10));
            var moduleField = new FieldSchema("MODULE NAME", "module_name", "Select", 1, true)
            {
                dynamic = true,
                temp = false
            };

            foreach (var module in ModuleManager.Instance.SourceModules)
            {
                var moduleOptions = new OptionsSchema(module.Key, module.Key);
                var methodField = new FieldSchema("METHOD NAME", "method_name", "Select", 1, true) { dynamic = true, temp = true };
                foreach (var method in module.Value.GetConfig())
                {
                    var methodOptions = new OptionsSchema(method.Key, method.Key);
                    
                    foreach (var options in method.Value)
                    {
                        var optionsField = new FieldSchema(options.Key, options.Key, "Text", 2, true) { temp = true, datakey = "options" };
                        methodOptions.AddFields(optionsField);
                    }

                    methodField.AddOptions(methodOptions);
                    moduleOptions.AddFields(methodField);
                }
                moduleField.AddOptions(moduleOptions);
            }
            fields.Add(moduleField);

            fields.Add(new FieldSchema("WEEKDAYS", "weekdays", "MultiSelect", 3, true) { datakey = "schedule" }
                .AddOptions(new OptionsSchema("MON", "월요일"))
                .AddOptions(new OptionsSchema("TUE", "화요일"))
                .AddOptions(new OptionsSchema("WED", "수요일"))
                .AddOptions(new OptionsSchema("THU", "목요일"))
                .AddOptions(new OptionsSchema("FRI", "금요일"))
                .AddOptions(new OptionsSchema("SAT", "토요일"))
                .AddOptions(new OptionsSchema("SUN", "일요일")));
            fields.Add(new FieldSchema("START", "start", "TimePicker", 4, true) { datakey = "schedule" });
            fields.Add(new FieldSchema("END", "end", "TimePicker", 4, true) { datakey = "schedule" });
            fields.Add(new FieldSchema("INTERVAL", "interval", "Number", 4, true) { datakey = "schedule" });
            fields.Add(new FieldSchema("STATUS", "status", "Data", 5));
            fields.Add(new FieldSchema("UPDATED TIME", "unixtime", "Data", 5));

            return DataConverter.Serializer<List<FieldSchema>>(fields);
        }

        public string GetList()
        {
            var selectedItems = new List<string>() { "name", "module_name", "method_name", "COLUMN_JSON(options) as options",
                                                     "COLUMN_JSON(schedule) as schedule", "status", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems);
            var res = MariaDBConnector.Instance.GetJsonArray(query);

            return res.ToString();
        }

        public string Create(JsonValue jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, false);

            var res = MariaDBConnector.Instance.SetQuery(upsertQuery);

            return res.ToString();
        }

        public string Modify(JsonValue jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, true);

            var res = MariaDBConnector.Instance.SetQuery(upsertQuery);

            return res.ToString();
        }
    }
}
