using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Request
{
    public class ViewExecuteReq
    {
        public string name { get; set; }
        public string member_id { get; set; }
    }

    public class PlaybackReq
    {
        public string categories { get; set; }
    }
}
