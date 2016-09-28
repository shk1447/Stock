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

        public string Access(string member_id, string password)
        {
            var selectedItems = new List<string>() { "member_id", "member_name", "password", "privilege", "email", "phone_number" };
            var whereKV = new Dictionary<string, string>() { { "member_id", member_id }, { "password", password } };
            var selectQuery = MariaQueryBuilder.SelectQuery(TableName, selectedItems, whereKV);
            var member = MariaDBConnector.Instance.GetOneQuery<Member>(selectQuery);

            if (member == null)
            {
                member = new Member();
                member.code = "400";
                member.message = "Fail";
            }
            else
            {
                member.code = "200";
                member.message = "Success";
            }

            return DataConverter.Serializer<Member>(member);
        }

        public string Create(JsonDictionary jsonObj)
        {
            var res = new CommonResponse()
            {
                code = "200",
                message = "Success"
            };

            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj.GetDictionary(), false);

            if (!MariaDBConnector.Instance.SetQuery(upsertQuery))
            {
                res.code = "400";
                res.message = "동일한 아이디가 존재합니다.";
            }
            return DataConverter.Serializer<CommonResponse>(res);
        }
    }
}
