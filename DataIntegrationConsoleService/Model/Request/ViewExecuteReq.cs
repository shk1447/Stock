using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Request
{
    public class ViewExecuteReq
    {
        public JsonValue name { get; set; }

        public JsonValue member_id { get; set; }
    }
}
