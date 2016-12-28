using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.ServiceModel.Discovery;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Log;
using log4net.Config;
using DIWebSocket;
using System.Configuration;

namespace DataIntegrationService
{
    public class DataIntegrationServiceStarter
    {
        private readonly List<ServiceHost> hosts = new List<ServiceHost>();
        private bool hostOpenInfo = false;

        public DataIntegrationServiceStarter(string serviceUrl)
        {
            ServicePointManager.UseNagleAlgorithm = true;
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.CheckCertificateRevocationList = true;
            ServicePointManager.DefaultConnectionLimit = 10000;

            var restHost = new WebServiceHost(typeof(DataIntegrationService), new Uri(serviceUrl));

            var webHttpBinding = new WebHttpBinding()
            {
                CrossDomainScriptAccessEnabled = true,
                MaxBufferSize = int.MaxValue,
                MaxReceivedMessageSize = int.MaxValue,
                MaxBufferPoolSize = int.MaxValue,
                ReaderQuotas = new XmlDictionaryReaderQuotas()
                {
                    MaxArrayLength = int.MaxValue,
                    MaxBytesPerRead = int.MaxValue,
                    MaxDepth = int.MaxValue,
                    MaxNameTableCharCount = int.MaxValue,
                    MaxStringContentLength = int.MaxValue
                }
            };

            AddDiscovery(restHost, typeof(DataIntegrationService));

            var restEndPoint = restHost.AddServiceEndpoint(typeof(IDataIntegrationService), webHttpBinding, new Uri(serviceUrl));
            ServiceThrottlingBehavior behavior = new ServiceThrottlingBehavior()
            {
                MaxConcurrentCalls = Environment.ProcessorCount * 16,
                MaxConcurrentInstances = Int32.MaxValue,
                MaxConcurrentSessions = Environment.ProcessorCount * 100
            };
            restHost.Description.Behaviors.Add(behavior);
            restEndPoint.Behaviors.Add(new WebHttpBehavior()
            {
                HelpEnabled = true,
                AutomaticFormatSelectionEnabled = false
            });

            hosts.Add(restHost);

            Console.WriteLine("Start Data Integration Service : ");
            Console.WriteLine(" \t" + serviceUrl);

            this.Run();

            DIWebSocketServer.Instance.Start(ConfigurationManager.AppSettings["WebSocketServerPort"]);
        }

        // <summary>
        ///   Gets BaseAddresses.
        /// </summary>
        public List<Uri> BaseAddresses
        {
            get
            {
                if (hosts == null || hosts.Count == 0)
                {
                    return null;
                }

                var addresses = new List<Uri>();

                foreach (var serviceHost in hosts)
                {
                    addresses.AddRange(serviceHost.BaseAddresses);
                }

                return addresses;
            }
        }

        /// <summary>
        /// The close.
        /// </summary>
        public void Close()
        {
            if (hosts != null && hosts.Count != 0)
            {
                hosts.AsParallel().ForAll(host => host.Close());
                hosts.Clear();
            }
        }

        /// <summary>
        /// The run.
        /// </summary>
        public void Run()
        {
            try
            {
                if (hosts == null || hosts.Count == 0)
                {
                    throw new Exception("Run Server Fail. There are no host Exists.");
                }

                foreach (var serviceHost in hosts)
                {
                    try
                    {
                        serviceHost.Open();
                        Console.WriteLine("ServiceState : " + serviceHost.State);
                        serviceHost.Description.Endpoints.AsParallel()
                                   .ForAll(
                                       ep => LogWriter.Info("Service is Running on {0}", ep.Address));

                        this.hostOpenInfo = true;
                    }
                    catch (CommunicationException cex)
                    {
                        Console.WriteLine("ServiceState : " + serviceHost.State);
                        Console.WriteLine(cex.ToString());
                        LogWriter.Info(cex.ToString());
                        serviceHost.Abort();

                        hostOpenInfo = false;
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
            }
        }

        public void Dispose()
        {
            this.Close();
        }

        public bool HostOpenInfo()
        {
            return this.hostOpenInfo;
        }

        /// <summary>
        /// 현재 컴퓨터 주소들을 XML 형식으로 반환 함.
        /// </summary>
        public static XElement GetLocalAddresses()
        {
            var root = new XElement("Addresses");

            IPAddress[] address = Dns.GetHostAddresses(Dns.GetHostName());

            foreach (var item in address)
            {
                root.Add(new XElement("Address", item.ToString()));
            }

            return root;
        }

        public static void AddDiscovery(ServiceHost host, Type serviceType)
        {
            // Add a ServiceDiscoveryBehavior                
            host.Description.Behaviors.Add(new ServiceDiscoveryBehavior());

            // Add a UdpDiscoveryEndpoint
            var udpDiscoveryEndpoint = new UdpDiscoveryEndpoint();
            host.AddServiceEndpoint(udpDiscoveryEndpoint);

            // Add a discovery behavior for Meta Extensions
            EndpointDiscoveryBehavior endpointDiscoveryBehavior = new EndpointDiscoveryBehavior();
            endpointDiscoveryBehavior.Extensions.Add(GetLocalAddresses());
            host.Description.Endpoints[0].Behaviors.Add(endpointDiscoveryBehavior);
        }
    }
}
