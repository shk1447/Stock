using Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Response
{
    public class Member
    {
        public string member_id { get; set; }
        public string member_name { get; set; }
        public string password { get; set; }
        public string privilege { get; set; }
        public string email { get; set; }
        public string phone_number { get; set; }
    }
}
