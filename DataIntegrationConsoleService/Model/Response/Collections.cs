using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class Collections
    {
        public CodeMessage message { get; set; }

        public List<FieldSchema> schema { get; set; }

        public List<Collection> result { get; set; }

        public Collections(bool success, List<Collection> collections = null)
        {
            this.message = new CodeMessage(success);
            this.result = success ? collections : new List<Collection>();
        }
    }
}
