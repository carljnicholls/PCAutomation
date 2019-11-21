using System;

namespace DataTransfer.Exceptions
{
    public class GlobalException: Exception
    {
        private const string ErrorMessage = "Global Exception: {0} {1}";

        public GlobalException()
        {
            
        }

        /// <summary>
        /// Writes `Exception.Message` to `Console.Error`
        /// </summary>
        /// <param name="exception"></param>
        public GlobalException(Exception exception)
        {
            WriteError(exception.Message);
        }

        /// <summary>
        /// Writes `Message` to `Console.Error`  
        /// </summary>
        /// <param name="message"></param>
        public GlobalException(string message)
        {
            WriteError(message);
        }

        private static void WriteError(string message)
        {
            Console.Error.Write(string.Format(
                ErrorMessage,
                System.Environment.NewLine, 
                message
            ));
            Console.WriteLine();
        }
    }
}