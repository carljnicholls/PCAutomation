using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataTransfer.Validators;
using Interfaces.Validators;
using Enums;

namespace Services.ArgsValidator
{
    public class ArgsValidator : IArgsValidator
    {
        public ArgsValidator()
        {
            
        }
        
        public async Task<ValidationResultDto> Validate(IEnumerable<string> args)
        {
            var messages = CheckForNullOrEmpty(args);
            if(messages.Count() > 0) return new ValidationResultDto()
            {
                HasWarn = true, 
                IsValid = false, 
                Messages = messages
            };

            var validationResults = ValidateArgs(args);
            if(validationResults.Count() > 0) 
            {
                return ParseValidationErrors(validationResults);
            }

            // Any further Validation...

            return new ValidationResultDto
            {
                HasWarn = false, 
                IsValid = true, 
                Messages = new string[0]
            };
        }

        private IEnumerable<string> CheckForNullOrEmpty(IEnumerable<string> args)
        {
            var messages = new List<string>();
            var argsList = args.ToList();

            for (int i = 0; i < argsList.Count; i++)
            {
                if (!string.IsNullOrWhiteSpace(argsList[i])) continue;

                messages.Add(string.Format("Argument {0} is not valid.", i + 1)); 
            }

            return messages.ToList();
        }

        private IEnumerable<ValidationResultDto> ValidateArgs(IEnumerable<string> args)
        {
            var argsList = args.ToList();
            var errorList = new List<ValidationResultDto>();

            foreach (var arg in argsList)
            {
                var validParameter = TryGetValidParam(arg);
                if(validParameter == null) errorList.Add(new ValidationResultDto()
                {
                    HasWarn = true, 
                    IsValid = false, 
                    Messages = new string[] { string.Format("Parameter {0} does not exist", arg) }
                }); 
            }

            return errorList;
        }

        private ValidParameterEnum TryGetValidParam(string arg)
        {
            return ValidParameterEnum
                .GetAll<ValidParameterEnum>()
                .FirstOrDefault(param => param.Name == arg);   
        }

        private ValidationResultDto ParseValidationErrors(IEnumerable<ValidationResultDto> validationResults)
        {
            var errorMessages = new List<string>();
            var resultsList = validationResults.ToList();

            foreach (var result in resultsList)
            {
                errorMessages.AddRange(result.Messages);
            }
            return new ValidationResultDto()
            {
                HasWarn = true, 
                IsValid = false, 
                Messages = errorMessages
            };
        }
    }
}