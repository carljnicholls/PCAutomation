using System.Threading.Tasks;
using NUnit.Framework;

namespace UnitTests.ServiceTests.Validators
{
    [TestFixture]
    public class ArgsValidator_Validate : ArgsValidatorSpec
    {
        [TestCase("1")] //, TestName="With A Number" )]
        [TestCase("")] // ,TestName="With A Empty String" )]
        [TestCase(" ")] // , TestName="With A White Space" )]
        public async Task NullOrEmptySingleParam_IsValidIsFalse(string arg) 
        {
            await CallValidateAndAssertIsFalse(new string[] { arg });
        }

        [TestCase("1", "2")] // , TestName= "With Two Numbers" )]
        [TestCase("", "")] // , TestName="With Two Empty Strings" )]
        [TestCase(" ", " ")] // ], TestName="With Two White Space" )]
        [TestCase("1", "")] // , TestName="With Number and Empty" )]
        [TestCase("1", " ")] // , TestName="With Number and White Space" )]
        [TestCase("", " ")] // , TestName="With Empty and White Space" )]
        [TestCase("", "1")] // , TestName="With Empty and Number" )]
        [TestCase(" ", "1")] // , TestName="With White Space and Number" )]
        [TestCase(" ", "")] // , TestName="With White Space and Empty" )]
        public async Task NullOrEmptyDualParam_IsValidIsFalse(string arg1, string arg2) 
        {
            await CallValidateAndAssertIsFalse(new string[] { arg1, arg2 });
        }
    }
}