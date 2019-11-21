using System.Collections.Generic;

namespace DataTransfer.Validators
{
    public class ValidationResultDto
    {
        public bool IsValid { get; set; }
        public bool HasWarn { get; set; }
        public IEnumerable<string> Messages { get; set; }
    }
}