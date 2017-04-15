using AngularjsTokenAuthentication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace AngularjsTokenAuthentication.App_Code
{
    public static class CreateFromSpecialCharacter
    {
        public static string FromSpecialCharacter(SpecialSection model)
        {
            string regexp = "";

            if (model.category == "All")
            {
                regexp = "$@!%*?&";
            }else if(model.category== "custom")
            {
                regexp = FromCustom(model.customText);
            }

            return regexp;
        }

        private static string FromCustom(string customText)
        {
            string SeparateText = "";

            string[] textArray = Regex.Split(customText, ",");
            foreach (string str in textArray)
            {
                SeparateText = SeparateText + str;
            }

            return SeparateText;
        }

        public static string FromAtLeast(SpecialSection model)
        {
            string atleast = "";

            if (model.atLeastOne)
            {
                atleast = atleast = "(?=.*[$@!%*?&])";
            }

            return atleast;
        }

        public static string FromAtLeast(SpecialSection model, bool isOk)
        {
            string atleast = "";

            if (model.atLeastOne)
            {
                atleast = atleast + "$@!%*?&";
            }

            return atleast;
        }
    }
}