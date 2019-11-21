using System;
using System.Linq;
using System.Threading.Tasks;
using DataTransfer.Exceptions;
using Services.ArgsValidator;

namespace App
{
    public class Program
    {
        static async Task Main(string[] args)
        {
            try
            {
                                // Console.ReadKey();

                await Console.Out.WriteLineAsync("Application Starting ");

                if(args == null || args.Count() == 0)
                {
                    await Console.Out.WriteLineAsync("No Args provided. Application Closing");
                    return;
                }

                var validator = new ArgsValidator(); 
                var app = new App(
                    validator
                );

                await app.Run(args);

                // throw new Exception("checking the throw result");
            }
            catch(Exception ex)
            {
                throw new GlobalException(ex);
            }
            finally
            {
                await Console.Out.WriteLineAsync("Press Any Key to Close Application...");
                Console.ReadKey();
            }   
        }
    }
}
