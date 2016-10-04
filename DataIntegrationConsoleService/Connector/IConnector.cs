using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Connector
{
    interface IConnector
    {
        List<JsonDictionary> GetQuery(string query, object parameterValues = null);

        CodeMessage SetQuery(string query, object parameterValues = null);
    }
}
