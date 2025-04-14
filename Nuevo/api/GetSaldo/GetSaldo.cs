using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MailKit.Net.Imap;
using MailKit.Search;
using MailKit.Security;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Auth.OAuth2;
using System.IO;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Globalization;




namespace GetSaldoFunction
{
    public static class GetSaldo
    {

        static decimal ExtraerMonto(string texto)
        {
            var regex = new Regex(@"UYU\s+([\d.,]+)");
            var match = regex.Match(texto);
            if (match.Success)
            {
                if (decimal.TryParse(match.Groups[1].Value.Replace(".", ""), out var result))
                    return result;
            }
            return 0;
        }

        [FunctionName("GetSaldo")]
        public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetSaldo")] HttpRequest req,
        ILogger log)
        {


            decimal totalGastosShort = 0;
            decimal totalGastosMid = 0;
            decimal totalGastosBig = 0;
            decimal totalGastos = 0;
            string fechaS = "";

            string[] scopes = { GmailService.Scope.GmailReadonly };


            string authHeader = req.Headers["Authorization"];


            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return new BadRequestObjectResult("Missing or invalid Authorization header");

            string accessToken = authHeader.Substring("Bearer ".Length).Trim();

            var credential = GoogleCredential.FromAccessToken(accessToken);

            var service = new GmailService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "consultSaldo"
            });


            var desde = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1).ToString("yyyy/MM/dd");
            
            var hasta = DateTime.UtcNow.ToString("yyyy/MM/dd");

            var request = service.Users.Messages.List("me");
            request.Q = $"from:notificaciones@santander.com.uy after:{desde} before:{hasta} in:inbox -from:me";

            var response = await request.ExecuteAsync();
            IList<Message> messages = response.Messages;

            if (messages != null)
            {

                List<DateTimeOffset> fechas = new();

                foreach (var msg in messages)
                {
                    var messageDetail = await service.Users.Messages.Get("me", msg.Id).ExecuteAsync();
                    var snippet = messageDetail.Snippet;

                    var dateHeader = messageDetail.Payload.Headers.FirstOrDefault(h => h.Name.Equals("Date", StringComparison.OrdinalIgnoreCase));

                    decimal monto = ExtraerMonto(snippet);

                    if (monto > 0 && monto < 1000)
                        totalGastosShort += monto;
                    else if (monto >= 1000 && monto < 5000)
                        totalGastosMid += monto;
                    else if (monto >= 5000)
                        totalGastosBig += monto;

                    if (dateHeader != null)
                    {
                        var rawDate = dateHeader.Value;
                        var cleanDate = rawDate.Split('(')[0].Trim();

                        if (DateTimeOffset.TryParse(cleanDate, out var fechaOffset))
                        {
                            fechas.Add(fechaOffset);
                        }
                    }
                }

                if (fechas.Any())
                {
                    fechaS = fechas.Max().ToString("yyyy/MM/dd");
                }

                totalGastos = totalGastosShort + totalGastosMid + totalGastosBig;
            }



            return new OkObjectResult(new { gastoShort = totalGastosShort, gastoMid = totalGastosMid, gastoBig = totalGastosBig, totalGasto = totalGastos, fechaUlt = fechaS });
        }
    }
}
