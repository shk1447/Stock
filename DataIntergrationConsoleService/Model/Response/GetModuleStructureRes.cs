﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class GetModuleStructureRes
    {
        private Dictionary<string, Dictionary<string, JsonDictionary>> collectionModule;

        public Dictionary<string, Dictionary<string, JsonDictionary>> CollectionModules
        {
            get
            {
                return this.collectionModule;
            }
            set
            {
                this.collectionModule = value;
            }
        }

        public GetModuleStructureRes()
        {
            this.collectionModule = new Dictionary<string, Dictionary<string, JsonDictionary>>();
        }
    }
}