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
            this.result = success ? members : new List<Member>();
        }
    }
}
