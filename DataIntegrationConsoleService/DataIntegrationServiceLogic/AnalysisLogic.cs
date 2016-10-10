using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using Helper;
using Model.Common;

namespace DataIntegrationServiceLogic
{
    public class AnalysisLogic
    {
        private const string TableName = "data_analysis";

        public string Schema()
        {
            var fields = new List<FieldSchema>();

            fields.Add(new FieldSchema("ANALYSIS NAME", "name", "Text", 0, true).AddAttributes("maxlength", 10));
            var sourceField = new FieldSchema("SOURCE NAME", "source", "Select", 1, true)
            {
                dynamic = true,
                temp = false
            };

            var sourceQuery = MariaQueryDefine.getSourceInformation;
            var sources = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", sourceQuery);

            foreach (var source in sources)
            {
                var sourceName = source["TABLE_NAME"].ReadAs<string>();
                var options = new OptionsSchema(sourceName.Replace("current_", ""), sourceName.Replace("current_", ""));
                sourceField.AddOptions(options);
            }
            fields.Add(sourceField);

            fields.Add(new FieldSchema("ANALYSIS QUERY", "analysis_query", "SQLEditor", 2));
            fields.Add(new FieldSchema("OPTIONS", "options", "AddFields", 3, true) { datakey = "options" });
            fields.Add(new FieldSchema("COLLECTED AT", "collected_at", "Text", 3));

            fields.Add(new FieldSchema("WEEKDAYS", "weekdays", "MultiSelect", 4, true) { datakey = "schedule" }
                .AddOptions(new OptionsSchema("MON", "월요일"))
                .AddOptions(new OptionsSchema("TUE", "화요일"))
                .AddOptions(new OptionsSchema("WED", "수요일"))
                .AddOptions(new OptionsSchema("THU", "목요일"))
                .AddOptions(new OptionsSchema("FRI", "금요일"))
                .AddOptions(new OptionsSchema("SAT", "토요일"))
                .AddOptions(new OptionsSchema("SUN", "일요일")));
            fields.Add(new FieldSchema("START", "start", "TimePicker", 5, true) { datakey = "schedule" });
            fields.Add(new FieldSchema("END", "end", "TimePicker", 5, true) { datakey = "schedule" });
            fields.Add(new FieldSchema("INTERVAL", "interval", "Number", 5, true) { datakey = "schedule" });
            fields.Add(new FieldSchema("STATUS", "status", "Data", 5));
            fields.Add(new FieldSchema("UPDATED TIME", "unixtime", "Data", 5));

            return DataConverter.Serializer<List<FieldSchema>>(fields);
        }
    }
}
