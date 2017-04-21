using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SourceModuleManager
{
    public class AssemblyLoader
    {
        private static readonly Dictionary<string, object> instanceDic = new Dictionary<string, object>();

        private static readonly string moduleFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Modules");

        static AssemblyLoader()
        {
            AppDomain.CurrentDomain.AssemblyResolve += CurrentDomain_AssemblyResolve;
            if (!Directory.Exists(moduleFilePath))
                Directory.CreateDirectory(moduleFilePath);
        }

        private static Assembly CurrentDomain_AssemblyResolve(object sender, ResolveEventArgs args)
        {
            foreach (var file in Directory.GetFiles(moduleFilePath))
            {
                if (string.Compare((new FileInfo(file)).Extension.ToUpper(), ".DLL") != 0)
                    continue;

                var assembly = Assembly.Load(File.ReadAllBytes(file));

                if (string.Compare(args.Name, assembly.FullName) == 0)
                {
                    return assembly;
                }
            }

            return null;
        }

        public static T LoadOne<T>(string moduleName) where T : class
        { 
            try
            {
                
                var assembly = Assembly.LoadFile(Path.Combine(moduleFilePath, moduleName));

                foreach (var type in assembly.GetTypes())
                {
                    try
                    {
                        var instance = Activator.CreateInstance(type) as T;

                        if (instance != null)
                        {
                            return instance;
                        }
                    }
                    catch { }
                }    

                return null;
            }
            catch
            {
                return null;
            }
        }

        public static Dictionary<string, T> LoadAll<T>() where T : class
        {
            var ret = new Dictionary<string, T>();

            foreach (var file in new DirectoryInfo(moduleFilePath).GetFiles())
            {
                if (string.Compare(file.Extension, ".dll") != 0) continue;

                try
                {
                    foreach (var type in Assembly.LoadFile(file.FullName).GetTypes())
                    {
                        try
                        {
                            var dllInstance = Activator.CreateInstance(type) as T;

                            if (dllInstance != null)
                                ret.Add(file.Name, dllInstance);
                        }
                        catch {}
                    }
                }
                catch { }
            }

            return ret;
        }
    }
}
