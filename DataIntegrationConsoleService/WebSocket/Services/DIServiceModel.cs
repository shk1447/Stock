using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace DIWebSocket.Services
{
    public class DIServiceRequestModel
    {
        public bool broadcast { get; set; }

        public string target { get; set; }

        public JsonDictionary parameters { get; set; }
    }
}
