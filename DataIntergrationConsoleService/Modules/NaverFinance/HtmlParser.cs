using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace NaverFinance
{
    public class HtmlParser
    {
        private const RegexOptions ExpressionOptions = RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase;

        private const string CommentPattern = "<!--(.*?)-->";
        private const string TablePattern = "<table[^>]*>(.*?)</table>";
        private const string HeaderPattern = "<th[^>]*>(.*?)</th>";
        private const string RowPattern = "<tr[^>]*>(.*?)</tr>";
        private const string CellPattern = "<td[^>]*>(.*?)</td>";

        public static DataSet ParseDataSet(string html, ref DataSet refSet)
        {
            DataSet dataSet = refSet;
            MatchCollection tableMatches = Regex.Matches(
                WithoutComments(html),
                TablePattern,
                ExpressionOptions);

            int tableCount = 0;
            foreach (Match tableMatch in tableMatches)
            {
                var refTable = dataSet.Tables.Count == tableMatches.Count ? dataSet.Tables[tableCount] : null;
                if (dataSet.Tables.Count == tableMatches.Count)
                {
                    ParseTable(tableMatch.Value, ref refTable);
                }
                else
                {
                    dataSet.Tables.Add(ParseTable(tableMatch.Value, ref refTable));
                }
                tableCount++;
            }

            return dataSet;
        }

        public static DataTable ParseTable(string tableHtml, ref DataTable refTable)
        {
            string tableHtmlWithoutComments = WithoutComments(tableHtml);

            DataTable dataTable = new DataTable();
            if (refTable != null)
                dataTable = refTable;

            MatchCollection rowMatches = Regex.Matches(
                tableHtmlWithoutComments,
                RowPattern,
                ExpressionOptions);

            if (refTable == null)
            {
                dataTable.Columns.AddRange(tableHtmlWithoutComments.Contains("<th")
                                               ? ParseColumns(tableHtml)
                                               : GenerateColumns(rowMatches));
            }

            ParseRows(rowMatches, dataTable);

            return dataTable;
        }

        private static void ParseRows(MatchCollection rowMatches, DataTable dataTable)
        {
            foreach (Match rowMatch in rowMatches)
            {
                if (!rowMatch.Value.Contains("<th"))
                {
                    DataRow dataRow = dataTable.NewRow();

                    MatchCollection cellMatches = Regex.Matches(
                        rowMatch.Value,
                        CellPattern,
                        ExpressionOptions);
                    if (dataRow.ItemArray.Count() == cellMatches.Count)
                    {
                        for (int columnIndex = 0; columnIndex < cellMatches.Count; columnIndex++)
                        {
                            Console.WriteLine(Regex.Match(cellMatches[columnIndex].Groups[1].ToString(), "code=(.*?)\"").Groups.Count);
                            dataRow[columnIndex] = cellMatches[columnIndex].Groups[1].ToString();
                        }

                        dataTable.Rows.Add(dataRow);
                    }
                }
            }
        }

        private static DataColumn[] GenerateColumns(MatchCollection rowMatches)
        {
            int columnCount = Regex.Matches(
                rowMatches[0].ToString(),
                CellPattern,
                ExpressionOptions).Count;

            return (from index in Enumerable.Range(0, columnCount)
                    select new DataColumn("Column " + Convert.ToString(index))).ToArray();
        }

        private static DataColumn[] ParseColumns(string tableHtml)
        {
            MatchCollection headerMatches = Regex.Matches(
                tableHtml,
                HeaderPattern,
                ExpressionOptions);

            return (from Match headerMatch in headerMatches
                    select new DataColumn(headerMatch.Groups[1].ToString())).ToArray();
        }

        private static string WithoutComments(string html)
        {
            return Regex.Replace(html, CommentPattern, string.Empty, ExpressionOptions);
        }
    }
}
