using AngularjsTokenAuthentication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace AngularjsTokenAuthentication.App_Code
{
    public static class CreateFromAlphabet
    {
        private static string regexp="";
        public static string FromAlphabet(AlphabetSection model)
        {
            if (model.category == "All")
            {
                regexp = "A-Za-z";
            }else if (model.category == "Capital")
            {
                regexp = "A-Z";
            }else if (model.category == "Small")
            {
                regexp = "a-z";
            }else if (model.category == "CustomAlphabet")
            {
              regexp = FromCustomeAlphabet(model.customAlphabet);

            }else if (model.category == "CustomText")
            {
                regexp="("+model.customText+")";

            }

            return regexp;
        }

        public static string FromCustomeAlphabet(string Alphabet)
        {
            string SeparateText = "";

            string[] textArray= Regex.Split(Alphabet, ",");
            foreach(string str in textArray)
            {
                SeparateText = SeparateText + str;
            }

            return SeparateText;
            
        }

        public static string FromAtLeastOne(AlphabetSection model)
        {
            string atleast = "";

            if ((model.atLeastOneCapital) && (model.atLeastOneSmall))
            {
                atleast = atleast + "(?=.*[A-Z])(?=.*[a-z])";
            }else if (model.atLeastOneCapital)
            {
                atleast = atleast + "(?=.*A-Z])";
            }else if (model.atLeastOneSmall)
            {
                atleast = atleast + "(?=.*[a-z])";
            }

            return atleast;
        }

        public static string FromAtLeastOne(AlphabetSection model, bool isOk)
        {
            string atleast = "";

            if ((model.atLeastOneCapital) && (model.atLeastOneSmall))
            {
                atleast = atleast + "a-zA-Z";
            }
            else if (model.atLeastOneCapital)
            {
                atleast = atleast + "A-Z";
            }
            else if (model.atLeastOneSmall)
            {
                atleast = atleast + "a-z";
            }

            return atleast;
        }

    }
}