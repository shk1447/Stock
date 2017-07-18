using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using kr.ac.kaist.swrc.jhannanum.comm;
using kr.ac.kaist.swrc.jhannanum.hannanum;
//using kr.ac.kaist.swrc.jhannanum.comm;
//using kr.ac.kaist.swrc.jhannanum.hannanum;

namespace DataIntegrationServiceLogic
{
    public class BotLogic
    {
        public BotLogic(string text)
        {
            Workflow workflow = WorkflowFactory.getPredefinedWorkflow(WorkflowFactory.WORKFLOW_NOUN_EXTRACTOR);
            workflow.activateWorkflow(true);

            /* Analysis using the work flow */
            workflow.analyze(text);

            LinkedList<Sentence> resultList = workflow.getResultOfDocument(new Sentence(0, 0, false));
            foreach (Sentence s in resultList)
            {
                Eojeol[] eojeolArray = s.Eojeols;
                for (int i = 0; i < eojeolArray.Length; i++)
                {
                    if (eojeolArray[i].length > 0)
                    {
                        String[] morphemes = eojeolArray[i].Morphemes;
                        for (int j = 0; j < morphemes.Length; j++)
                        {
                            Console.WriteLine(morphemes[j]);
                        }
                    }
                }
            }
        }
    }
}
