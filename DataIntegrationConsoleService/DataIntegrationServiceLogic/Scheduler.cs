using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Connector;

namespace DataIntegrationServiceLogic
{
    public static class Scheduler
    {
        public static void ExecuteScheduler(string tableName, string action_type, JsonValue whereKV, JsonValue schedule, JsonValue setDict, Func<string, bool> action, Action notify)
        {
            string statusUpdate = string.Empty;
            var switchMode = "stop";
            if (action_type == "schedule")
            {
                var start = DateTime.Parse(schedule["start"].ReadAs<string>()).TimeOfDay;
                var end = DateTime.Parse(schedule["end"].ReadAs<string>()).TimeOfDay;
                //MON,TUE,WED,THU,FRI,SAT,SUN
                var weekDays = new List<string>();
                schedule["weekdays"].ToList().ForEach(a => weekDays.Add(a.Value.ReadAs<string>()));
                var interval = int.Parse(schedule["interval"].ReadAs<string>());

                while (true)
                {
                    var nowWeekDay = DateTime.Now.DayOfWeek.ToString().Substring(0, 3).ToUpper();
                    var nowTime = DateTime.Now.TimeOfDay;

                    if (weekDays.Contains(nowWeekDay) && nowTime > start && nowTime < end)
                    {
                        action.DynamicInvoke(switchMode);
                        switchMode = "play";
                    }
                    else
                    {
                        if (switchMode != "wait")
                        {
                            setDict["status"] = "wait";
                            statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
                            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", statusUpdate);
                            notify.DynamicInvoke();
                        }
                        switchMode = "wait";
                    }
                    Thread.Sleep(interval);
                }
            }
            else
            {
                action.DynamicInvoke(switchMode);
                setDict["status"] = "stop";
                statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", statusUpdate);
                notify.DynamicInvoke();
            }
        }
    }
}
