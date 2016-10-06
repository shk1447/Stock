using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Model.Common
{
    [DataContract]
    public class Schedule
    {
        [DataMember]
        public string WeekDay { get; set; }

        [DataMember]
        public string Start { get; set; }

        [DataMember]
        public string End { get; set; }

        [DataMember]
        public int Interval { get; set; }
    }
}
