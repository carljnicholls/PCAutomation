using System.Collections.Generic;
using System.Threading.Tasks;
using DataTransfer.Validators;

namespace Interfaces.Validators
{
    public interface IArgsValidator: IBaseValidator<string>
    {
        new Task<ValidationResultDto> Validate(IEnumerable<string> args);
    }
}