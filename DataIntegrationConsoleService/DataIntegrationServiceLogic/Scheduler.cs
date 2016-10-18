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
        public static void ExecuteScheduler(string tableName, JsonValue whereKV, JsonValue schedule, JsonValue setDict, Func<string, bool> action)
        {
            string statusUpdate = string.Empty;
            var switchMode = "wait";
            if (schedule != null)
            {
                var start = DateTime.Parse(schedule["start"].ToString()).TimeOfDay;
                var end = DateTime.Parse(schedule["end"].ToString()).TimeOfDay;
                //MON,TUE,WED,THU,FRI,SAT,SUN
                var weekDays = schedule["weekdays"].ToString().Split(',').ToList();
                var interval = int.Parse(schedule["interval"].ToString());

                while (true)
                {
                    var nowWeekDay = DateTime.Now.DayOfWeek.ToString().Substring(0, 3).ToUpper();
                    var nowTime = DateTime.Now.TimeOfDay;

                    if (weekDays.Contains(nowWeekDay) && nowTime > start && nowTime < end)
                    {
                        if (switchMode == "play") continue;
                        action.BeginInvoke(switchMode, new AsyncCallback((result) =>
                        {
                            setDict["status"] = "spinner";
                            statusUpdate = MariaQueryBuilder.UpdateQuery2(tableName, whereKV, setDict);
                            MariaDBConnector.Instance.SetQuery(statusUpdate);
                            switchMode = "spinner";
                        }), null);
                        if (switchMode != "spinner") switchMode = "play";
                    }
                    else
                    {
                        if (switchMode == "spinner" || switchMode == "wait")
                        {
                            setDict["status"] = "wait";
                            statusUpdate = MariaQueryBuilder.UpdateQuery2(tableName, whereKV, setDict);
                            MariaDBConnector.Instance.SetQuery(statusUpdate);
                        }

                        switchMode = "wait";
                    }
                    Thread.Sleep(interval);
                }
            }
            else
            {
                action.BeginInvoke(switchMode, new AsyncCallback((result) =>
                {
                    setDict["status"] = "stop";
                    statusUpdate = MariaQueryBuilder.UpdateQuery2(tableName, whereKV, setDict);
                    MariaDBConnector.Instance.SetQuery(statusUpdate);
                }), null);
            }
        }
    }
}
