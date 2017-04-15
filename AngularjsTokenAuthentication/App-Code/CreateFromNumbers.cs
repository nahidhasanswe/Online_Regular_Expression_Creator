using AngularjsTokenAuthentication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace AngularjsTokenAuthentication.App_Code
{
    public static class CreateFromNumbers
    {
        public static string FromNumber(NumberSection model)
        {
            string regexp = "";

            if (model.category == "All")
            {
                regexp = "0-9";
            }else if (model.category == "Custom")
            {
                regexp = FromCustomNumber(model.customNumber);
            }

            return regexp;
        }

        private static string FromCustomNumber(string customNumber)
        {
            string SeparateNumber = "";

            string[] textArray = Regex.Split(customNumber, ",");
            foreach (string str in textArray)
            {
                SeparateNumber = SeparateNumber + str;
            }

            return SeparateNumber;
        }

        public static string FromAtLeastOne(NumberSection model)
        {
            string atleat = "";

            if (model.atLeastOne)
            {
                atleat = atleat + "(?=.*[0-9])";
            }

            return atleat;
        }

        public static string FromAtLeastOne(NumberSection model, bool isOk)
        {
            string atleast = "";

            if (model.atLeastOne)
            {
                atleast = atleast + "0-9";
            }

            return atleast;
        }
    }
}