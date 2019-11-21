using System;
using System.Linq;
using System.Threading.Tasks;
using Interfaces.Validators;

namespace App
{
    public class App
    {
        private IArgsValidator _argsValidator;

        public App(
            IArgsValidator argsValidator
        )
        {
            _argsValidator = argsValidator;
        }

        public async Task Run(string[] args)
        {               
            await Console.Out.WriteLineAsync("App.Run() - Start");                
            await LogStuff(args);

            var validationResult = await _argsValidator.Validate(args);

            if(!validationResult.IsValid)
            {
                await LogStuff(validationResult.Messages.ToArray());
                return;
            }

            await Console.Out.WriteLineAsync("App.Run() - Is Valid");

            await Console.Out.WriteLineAsync("App.Run() - Finish");
        }

        private async Task LogStuff(string[] args)
        {
            foreach (var arg in args)
            {
                await Console.Out.WriteLineAsync(arg);                
            }
        }
    }
}