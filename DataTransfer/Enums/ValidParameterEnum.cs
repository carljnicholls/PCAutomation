using DataTransfer.Enums;

namespace Enums 
{
    public class ValidParameterEnum : Enumeration
    {
        public static ValidParameterEnum LockUser = new ValidParameterEnum(0, "lock");
        public static ValidParameterEnum Sleep = new ValidParameterEnum(1, "sleep");

        public ValidParameterEnum(int id, string name) : base(id, name)
        {
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return base.ToString();
        }
    }
}