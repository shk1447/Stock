using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace DataIntegrationServiceLogic
{
    public class MemberLogic
    {
        public CommonResponse Access(string userId, string password)
        {
            var res = new CommonResponse()
            {
                code = "200",
                message = "test"
            };
            return res;
        }

        public CommonResponse Create(string member_id, string member_name, string password, string privilege, string email, string phone_number_)
        {
            var res = new CommonResponse()
            {
                code = "200",
                message = "test"
            };
            return res;
        }
    }
}
