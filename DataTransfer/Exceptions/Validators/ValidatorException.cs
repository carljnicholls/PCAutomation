using System;
using System.Runtime.Serialization;

namespace DataTransfer.Exceptions.Validators
{
    public class ValidatorException: Exception
    {
        public ValidatorException() : base() { }
        public ValidatorException(string message) : base(message) { }
        public ValidatorException(string message, System.Exception inner) : base(message, inner) { }

        // A constructor is needed for serialization when an
        // exception propagates from a remoting server to the client. 
        protected ValidatorException(
            SerializationInfo info,
            StreamingContext context
        ) : base(info, context) { }
    }
}