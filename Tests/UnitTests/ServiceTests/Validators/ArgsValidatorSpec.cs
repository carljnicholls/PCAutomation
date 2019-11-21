using System.Threading.Tasks;
using Interfaces.Validators;
using Services.ArgsValidator;
using NUnit.Framework;

namespace UnitTests.ServiceTests.Validators
{
    [TestFixture]
    public abstract class ArgsValidatorSpec
    {
        public IArgsValidator Beans { get; set; }
        
        [SetUp]
        public void SetupSpec() 
        {
            Beans = new ArgsValidator();
        }

        /// <summary>
        /// Act, Assert
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        protected async Task CallValidateAndAssertIsFalse(string[] args)
        {
            var result = await Beans.Validate(args);

            Assert.IsFalse(result.IsValid);
        }
    }
}