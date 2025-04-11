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
                if (decimal.TryParse(match.Groups[1].Value.Replace(".", "").Replace(",", "."), out var result))
                    return result;
            }
            return 0;
        }

        [FunctionName("GetSaldo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            string email = "joaquinpeluffo7@gmail.com";
            string appPassword = "uoha qbrq tjim ydph";

            using var cliente = new ImapClient();
            cliente.Connect("imap.gmail.com", 993, SecureSocketOptions.SslOnConnect);
            cliente.Authenticate(email, appPassword);

            var inbox = cliente.Inbox;
            inbox.Open(MailKit.FolderAccess.ReadOnly);

            var since = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var uids = inbox.Search(SearchQuery.DeliveredAfter(since));

            decimal totalGastosShort = 0;
            decimal totalGastosMid = 0;
            decimal totalGastosBig = 0;
            decimal totalGastos=0;

            foreach (var uId in uids)
            {
                var message = inbox.GetMessage(uId);
                if (message.From.Mailboxes.Any(m => m.Address == "notificaciones@santander.com.uy"))
                {
                    var texto = message.HtmlBody;

                    if (texto.Contains("n con tu tarjeta"))
                    {
                        decimal monto = ExtraerMonto(texto);
                        if (monto > 0 && monto < 1000) {
                            totalGastosShort += monto;
                        } else if (monto >= 1000 && monto < 5000) {
                            totalGastosMid += monto;
                        } else if (monto >= 5000) {
                            totalGastosBig += monto;
                        }
                        totalGastos = totalGastosShort+totalGastosMid+totalGastosBig;
                    }
                }
            }

            return new OkObjectResult(new{gastoShort=totalGastosShort,gastoMid=totalGastosMid,gastoBig=totalGastosBig,totalGasto = totalGastos});
        }
    }
}
