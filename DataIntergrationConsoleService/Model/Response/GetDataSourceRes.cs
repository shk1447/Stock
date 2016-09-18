﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class GetDataSourceRes
    {
        private List<JsonDictionary> rawdata;

        public List<JsonDictionary> RawData
        {
            get
            {
                return this.rawdata;
            }
            set
            {
                this.rawdata = value;
            }
        }

        public GetDataSourceRes()
        {
            this.rawdata = new List<JsonDictionary>();
        }
    }
}