using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Connector;
using Helper;
using Log;
using Model.Common;
using Model.Response;
using SourceModuleManager;

namespace DataIntegrationServiceLogic
{
    public class CollectionLogic
    {
        private static Dictionary<string, Thread> scheduleThread = new Dictionary<string, Thread>();

        private const string TableName = "data_collection";
        private AutoResetEvent autoResetEvent;
        private System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue;

        public CollectionLogic(ref AutoResetEvent autoResetEvent, ref System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue)
        {
            // TODO: Complete member initialization
            this.autoResetEvent = autoResetEvent;
            this.concurrentQueue = concurrentQueue;
        }

        public string Schema()
        {
            var fields = new List<FieldSchema>();

            fields.Add(new FieldSchema("STATUS", "status", "Action", 5));

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
                        var optionsField = new FieldSchema(options.Key, options.Key, "Text", 2, false) { temp = true, datakey = "options" };
                        methodOptions.AddFields(optionsField);
                    }

                    methodField.AddOptions(methodOptions);
                }
                moduleOptions.AddFields(methodField);
                moduleField.AddOptions(moduleOptions);
            }
            fields.Add(moduleField);

            var actionTypeField = new FieldSchema("ACTION TYPE", "action_type", "Select", 3, true)
            {
                dynamic = true,
                temp = false
            }.AddOptions(new OptionsSchema("schedule", "예약 실행").AddFields(new FieldSchema("WEEKDAYS", "weekdays", "MultiSelect", 4, false) { temp = true, datakey = "schedule" }
                    .AddOptions(new OptionsSchema("MON", "월요일"))
                    .AddOptions(new OptionsSchema("TUE", "화요일"))
                    .AddOptions(new OptionsSchema("WED", "수요일"))
                    .AddOptions(new OptionsSchema("THU", "목요일"))
                    .AddOptions(new OptionsSchema("FRI", "금요일"))
                    .AddOptions(new OptionsSchema("SAT", "토요일"))
                    .AddOptions(new OptionsSchema("SUN", "일요일")))
                .AddFields(new FieldSchema("START", "start", "TimePicker", 5, false) { datakey = "schedule", temp = true })
                .AddFields(new FieldSchema("END", "end", "TimePicker", 5, false) { datakey = "schedule", temp = true })
                .AddFields(new FieldSchema("INTERVAL", "interval", "Number", 5, false) { datakey = "schedule", temp = true }))
            .AddOptions(new OptionsSchema("once", "즉시 실행"));

            fields.Add(actionTypeField);

            fields.Add(new FieldSchema("UPDATED TIME", "unixtime", "Data", 6));

            return DataConverter.Serializer<List<FieldSchema>>(fields);
        }

        private void Notify()
        {
            var result = this.GetList();
            var msg = new JsonObject(new KeyValuePair<string, JsonValue>("result", result),
                                     new KeyValuePair<string, JsonValue>("broadcast", true),
                                     new KeyValuePair<string, JsonValue>("target", "collection"),
                                     new KeyValuePair<string, JsonValue>("method", "getlist"));
            this.concurrentQueue.Enqueue(msg);
            this.autoResetEvent.Set();
        }

        public string GetList()
        {
            var selectedItems = new List<string>() { "name", "module_name", "method_name", "action_type", "COLUMN_JSON(options) as options",
                                                     "COLUMN_JSON(schedule) as schedule", "status", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems);
            var result = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", query);

            var state = scheduleThread.Count > 0 ? "running" : "stop";
            var res = new JsonObject(new KeyValuePair<string, JsonValue>("state", state), new KeyValuePair<string, JsonValue>("result", result));

            return res.ToString();
        }

        public string Create(JsonValue jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, false);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", upsertQuery);

            this.Notify();

            return res.ToString();
        }

        public string Modify(JsonValue jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, true);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", upsertQuery);

            this.Notify();

            return res.ToString();
        }

        public string Delete(JsonValue jsonObj)
        {
            var deleteQuery = MariaQueryBuilder.DeleteQuery(TableName, jsonObj);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", deleteQuery);

            this.Notify();

            return res.ToString();
        }

        public string Execute(JsonValue jsonValue)
        {
            var res = new JsonObject();
            res.Add("code", "200");
            res.Add("message", "success");

            var name = jsonValue["name"].ReadAs<string>();
            var command = jsonValue["command"].ReadAs<string>();

            var selectedItems = new List<string>() { "name", "module_name", "method_name", "action_type",
                                                     "column_json(options) as options", "column_json(schedule) as schedule", "status", "unixtime" };
            var whereKV = new JsonObject(); whereKV.Add("name", name);

            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, whereKV);
            var moduleInfo = MariaDBConnector.Instance.GetJsonObject("DynamicQueryExecuter", query);

            var status = moduleInfo["status"].ReadAs<string>().ToLower();

            if (command != "stop" && (status == "play" || status == "wait"))
            {
                res["code"] = 400; res["message"] = "fail";
                return res.ToString();
            }

            var setDict = new JsonObject();
            setDict.Add("status", status);

            var action = new Func<string, bool>((switchMode) =>
            {
                try
                {
                    if (switchMode == "wait" || switchMode == "stop")
                    {
                        setDict["status"] = "play";
                        var statusUpdate = MariaQueryBuilder.UpdateQuery(TableName, whereKV, setDict);
                        MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", statusUpdate);
                        this.Notify();
                    }

                    var event_callback = new Func<string, bool>((code) =>
                    {
                        Console.WriteLine(code);
                        return true;
                    });

                    ModuleManager.Instance.ExecuteModule(moduleInfo, event_callback);
                }
                catch (Exception ex)
                {
                    LogWriter.Error(ex.ToString());
                }

                return true;
            });

            switch (command.ToLower())
            {
                case "start":
                    {
                        var statusUpdate = string.Empty;
                        var thread = new Thread(new ThreadStart(() =>
                        {
                            Scheduler.ExecuteScheduler(TableName, moduleInfo["action_type"].ReadAs<string>(), whereKV, moduleInfo["schedule"], setDict, action, this.Notify);
                        }));

                        if (scheduleThread.ContainsKey(name)) scheduleThread.Remove(name);
                        scheduleThread.Add(name, thread);
                        thread.Start();
                        Thread.Sleep(100);
                        break;
                    }
                case "stop":
                    {
                        scheduleThread[name].Abort();
                        scheduleThread.Remove(name);
                        setDict["status"] = "stop";
                        var statusUpdate = MariaQueryBuilder.UpdateQuery(TableName, whereKV, setDict);
                        MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", statusUpdate);
                        this.Notify();
                        break;
                    }
            }

            return res.ToString();
        }
    }
}
