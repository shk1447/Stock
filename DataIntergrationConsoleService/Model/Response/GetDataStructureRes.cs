﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class GetDataStructureRes
    {
        private List<JsonDictionary> dataStructure;

        public List<JsonDictionary> DataStructure
        {
            get
            {
                return this.dataStructure;
            }
            set
            {
                this.dataStructure = value;
            }
        }

        public GetDataStructureRes()
        {
            this.dataStructure = new List<JsonDictionary>();
        }
    }
}