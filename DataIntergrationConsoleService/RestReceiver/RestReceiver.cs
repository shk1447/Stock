using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Common;
using ModuleInterface;
using Helper;

namespace ExternalSourceMoudles
{
    public class RestReceiver : ISourceModule
    {
        public dynamic GetData(string config, string query, string type, int interval)
        {
            var reqParam = new RequestParameter()
            {
                Url = config,
                ContentType = "application/json",
                EncodingOption = "UTF8",
                Method = "GET"
            };

            var resultString = DecodeHex(HttpsRequest.Instance.GetResponseByHttps(reqParam));
            dynamic result = null;
            var dataType = type.ToLower();
            switch (dataType)
            {
                case "current" :
                    resultString = Regex.Replace(resultString, @"\n", "").Replace("//", "");
                    result = DataConverter.JsonToDictionary<List<Dictionary<object, object>>>(resultString);
                    break;
                case "json":
                    result = DataConverter.StringToDynamic(resultString);
                    break;
                case "csv":
                    var histroyCsv = Regex.Split(resultString, @"\n");
                    var csv = new List<Dictionary<string,string>>();

                    var standardTime = string.Empty;
                    for (int i = 7; i < histroyCsv.Length - 1; i++)
                    {
                        var keyArr = query.Split(',');
                        var dDict = new Dictionary<string, string>();
                        var row = histroyCsv[i].Split(',');
                        for(int k = 0; k < row.Length - 1; k++)
                        {
                            if (k == 0)
                            {
                                if (row[k].Trim().Contains("a"))
                                {
                                    standardTime = row[k].Trim().Replace("a", "");
                                    dDict.Add(keyArr[k].Trim(), standardTime);
                                }
                                else
                                {
                                    dDict.Add(keyArr[k].Trim(), (int.Parse(standardTime) + (interval * int.Parse(row[k]))).ToString());
                                }
                                continue;
                            }

                            dDict.Add(keyArr[k].Trim(), row[k].Trim());
                        }
                        csv.Add(dDict);
                    }
                    result = DataConverter.ObjectToDynamic(csv);
                    break;
                default:
                    result = resultString;
                    break;
            }

            return result;
        }

        public string DecodeHex(string data)
        {
            data = data.Replace(@"\x22", "&quot;");
            data = data.Replace(@"\x23", "#");
            data = data.Replace(@"\x24", "$");
            data = data.Replace(@"\x25", "%");
            data = data.Replace(@"\x26", "&");
            data = data.Replace(@"\x27", "'");
            data = data.Replace(@"\x28", "(");
            data = data.Replace(@"\x29", ")");
            data = data.Replace(@"\x2A", "*");
            data = data.Replace(@"\x2B", "+");
            data = data.Replace(@"\x2C", ",");
            data = data.Replace(@"\x2D", "-");
            data = data.Replace(@"\x2E", ".");
            data = data.Replace(@"\x2F", "/");
            data = data.Replace(@"\x30", "0");
            data = data.Replace(@"\x31", "1");
            data = data.Replace(@"\x32", "2");
            data = data.Replace(@"\x33", "3");
            data = data.Replace(@"\x34", "4");
            data = data.Replace(@"\x35", "5");
            data = data.Replace(@"\x36", "6");
            data = data.Replace(@"\x37", "7");
            data = data.Replace(@"\x38", "8");
            data = data.Replace(@"\x39", "9");
            data = data.Replace(@"\x3A", ":");
            data = data.Replace(@"\x3B", ";");
            data = data.Replace(@"\x3C", "<");
            data = data.Replace(@"\x3D", "=");
            data = data.Replace(@"\x3E", ">");
            data = data.Replace(@"\x3F", "?");
            return data;
        }
    }
}
