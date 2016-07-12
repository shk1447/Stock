using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ExternalSourceMoudles
{
    public class RequestParameter
    {
        public string Url { get; set; }

        public string EncodingOption { get; set; }

        public string PostMessage { get; set; }

        public string ContentType { get; set; }

        public string Method { get; set; }

        public enum CharacterSetEncodingOption
        {
            ASCII = 0,
            BigEndianUnicode = 1,
            Unicode = 2,
            UTF32 = 3,
            UTF7 = 4,
            UTF8 = 5,
            Default = 6
        }
    }

    public class RequestState
    {
        public WebRequest Request;
        public Stream ResponseStream;
        public string responseString;
        public bool IsReceive;

        public RequestState()
        {
            Request = null;
            ResponseStream = null;
            responseString = string.Empty;
            IsReceive = false;
        }
    }

    public class HttpsRequest : IDisposable
    {
        private static HttpsRequest instance;

        public static HttpsRequest Instance
        {
            get
            {
                if (instance != null)
                {
                    return instance;
                }

                instance = new HttpsRequest();

                return instance;
            }
        }

        private HttpsRequest()
        {
            ServicePointManager.ServerCertificateValidationCallback = this.ValidateMineCertificate;
            ServicePointManager.ServerCertificateValidationCallback += this.ValidateRemoteCertificate;
        }

        private bool ValidateRemoteCertificate(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
            return true;
            //return certificate.Subject.ToUpper().Contains("DATAPLATFORM");
        }

        private bool ValidateMineCertificate(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
            return true;
            //return certificate.Subject.ToUpper().Contains("DATAPLATFORM");
        }

        public string GetResponseByHttps(RequestParameter connectionInfo)
        {
            try
            {
                var request = (HttpWebRequest)WebRequest.Create(connectionInfo.Url);
                request.Proxy = null;
                request.Method = connectionInfo.Method.ToUpper();
                request.ContentType = connectionInfo.ContentType;
                request.ServicePoint.ConnectionLimit = 1000;
                request.Timeout = Timeout.Infinite;
                request.ReadWriteTimeout = Timeout.Infinite;
                request.ServicePoint.Expect100Continue = false;
                request.ServicePoint.UseNagleAlgorithm = false;

                if (connectionInfo.Method.ToUpper() == "POST")
                {
                    var byteArray = Encoding.UTF8.GetBytes(connectionInfo.PostMessage);

                    request.ContentLength = byteArray.Length;

                    using (var dataStream = request.GetRequestStream())
                    {
                        dataStream.Write(byteArray, 0, byteArray.Length);
                    }
                }


                string resultString = string.Empty;
                using (var response = request.GetResponse())
                {
                    using (var stream = response.GetResponseStream())
                    {
                        if (stream == null)
                        {
                            Console.WriteLine("[Get Response By Https Error]", "Response data is null.");
                        }
                        else
                        {
                            using (var streamReader = new StreamReader(stream))
                            {
                                resultString = streamReader.ReadToEnd();
                            }
                        }
                    }
                }
                request = null;
                return resultString;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        public RequestState GetAsyncResponseByHttps(RequestParameter connectionInfo, AsyncCallback resultCallback)
        {
            try
            {
                var request = (HttpWebRequest)WebRequest.Create(connectionInfo.Url);
                request.PreAuthenticate = true;
                request.Proxy = null;
                request.KeepAlive = false;
                request.Method = connectionInfo.Method.ToUpper();
                request.ContentType = connectionInfo.ContentType;
                request.Timeout = Timeout.Infinite;
                request.ServicePoint.UseNagleAlgorithm = false;
                request.ServicePoint.Expect100Continue = false;
                request.ServicePoint.ConnectionLimit = 1000;

                var cash = new CredentialCache();
                cash.Add(new Uri(connectionInfo.Url), "Basic", new NetworkCredential("n3ncollect", "welcome"));
                request.Credentials = cash;

                if (connectionInfo.Method.ToUpper() == "POST")
                {
                    var byteArray = Encoding.UTF8.GetBytes(connectionInfo.PostMessage);

                    request.ContentLength = byteArray.Length;

                    using (var dataStream = request.GetRequestStream())
                    {
                        dataStream.Write(byteArray, 0, byteArray.Length);
                    }
                }

                var reqState = new RequestState();

                reqState.Request = request;

                request.BeginGetResponse(resultCallback, reqState);

                return reqState;
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        #region IDisposable 멤버

        public void Dispose()
        {
            ServicePointManager.ServerCertificateValidationCallback -= this.ValidateRemoteCertificate;
        }

        #endregion
    }
}
