using System.Collections.Generic;
using System.Threading.Tasks;
using DataTransfer.Validators;

namespace Interfaces.Validators
{
    public interface IBaseValidator<T>
    {
        Task<ValidationResultDto> Validate(IEnumerable<T> args);
    }
}