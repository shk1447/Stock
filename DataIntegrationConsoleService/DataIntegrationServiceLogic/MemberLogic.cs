using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;
using Connector;
using Model.Response;
using Helper;

namespace DataIntegrationServiceLogic
{
    public class MemberLogic
    {
        private const string TableName = "member";

        public string Access(JsonDictionary where)
        {
            var selectedItems = new List<string>() { "member_id", "member_name", "password", "privilege", "email", "phone_number" };
            var whereKV = where.GetDictionary();
            var selectQuery = MariaQueryBuilder.SelectQuery(TableName, selectedItems, whereKV);
            var member = MariaDBConnector.Instance.GetQuery<Member>(selectQuery);

            var members = member == null ? new Members(true, member) : new Members(false);
            
            return DataConverter.Serializer<Members>(members);
        }

        public string Create(JsonDictionary jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj.GetDictionary(), false);

            var res = !MariaDBConnector.Instance.SetQuery(upsertQuery) ? new CodeMessage(false) : new CodeMessage(true);
            
            return DataConverter.Serializer<CodeMessage>(res);
        }
    }
}
