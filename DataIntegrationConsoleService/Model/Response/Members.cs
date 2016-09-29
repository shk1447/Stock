using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class Members
    {
        public CodeMessage reponse { get; set; }

        public List<FieldSchema> schema { get; set; }

        public List<Member> result { get; set; }

        public Members(bool success, List<Member> members = null)
        {
            this.reponse = new CodeMessage(success);
            this.schema = new List<FieldSchema>() {
                new FieldSchema("MEMBER ID","member_id","Input",1,new List<JsonDictionary>()),
                new FieldSchema("PASSWORD","password","password",1,new List<JsonDictionary>()),
                new FieldSchema("MEMBER_NAME","member_name","Input",1,new List<JsonDictionary>()),
                new FieldSchema("E-MAIL","email","Input",1,new List<JsonDictionary>()),
                new FieldSchema("PHONE NUMBER","phonenumber","Input",1,new List<JsonDictionary>())
            };
            this.result = success ? members : new List<Member>();
        }
    }
}
