using Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Model.Response
{
    [DataContract]
    public class Member
    {
        [DataMember]
        public string member_id { get; set; }
        [DataMember]
        public string password { get; set; }
        [DataMember]
        public string member_name { get; set; }
        [DataMember]
        public List<string> privilege { get; set; }
        [DataMember]
        public string email { get; set; }
        [DataMember]
        public string phone_number { get; set; }
    }
}
