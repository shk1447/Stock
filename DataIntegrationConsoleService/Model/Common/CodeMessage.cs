using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Common
{
    public class CodeMessage
    {
        public string code { get; set; }
        public string message { get; set; }

        public CodeMessage(bool success)
        {
            if (success)
            {
                this.code = "200"; this.message = "성공";
            }
            else
            {
                this.code = "400"; this.message = "실패";
            }
        }
    }
}
