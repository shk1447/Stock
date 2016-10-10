using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;
using Connector;
using Model.Response;
using Helper;
using System.Json;

namespace DataIntegrationServiceLogic
{
    public class MemberLogic
    {
        private const string TableName = "member";

        public string Schema()
        {
            var fields = new List<FieldSchema>();
            fields.Add(new FieldSchema("MEMBER ID", "member_id", "Text", 0, true).AddAttributes("maxlength", 10));
            fields.Add(new FieldSchema("PASSWORD", "password", "Password", 0, true).AddAttributes("maxlength", 10));
            fields.Add(new FieldSchema("MEMBER NAME", "member_name", "Text", 1, true).AddAttributes("maxlength", 10));
            fields.Add(new FieldSchema("PRIVILEGE", "privilege", "MultiSelect", 2)
                  .AddOptions(new OptionsSchema("manager", "MANAGER")).AddOptions(new OptionsSchema("user", "USER")));
            fields.Add(new FieldSchema("E-MAIL", "email", "Text", 3));
            fields.Add(new FieldSchema("PHONE NUMBER", "phone_number", "Text", 4));

            return DataConverter.Serializer<List<FieldSchema>>(fields);
        }

        public string Access(JsonValue where)
        {
            var selectedItems = new List<string>() { "member_id", "password", "member_name", "privilege", "email", "phone_number" };
            var selectQuery = MariaQueryBuilder.SelectQuery(TableName, selectedItems, where);
            var member = MariaDBConnector.Instance.GetJsonObject(selectQuery);

            return member.ToString();
        }

        public string GetList()
        {
            var selectedItems = new List<string>() { "member_id", "password", "member_name", "privilege", "email", "phone_number" };
            var selectQuery = MariaQueryBuilder.SelectQuery(TableName, selectedItems);
            var member = MariaDBConnector.Instance.GetJsonArray(selectQuery);

            return member.ToString();
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
