using AngularjsTokenAuthentication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngularjsTokenAuthentication.App_Code
{
    public class RegularExpression
    {
        private string regexp;
        private string regText;

        private string TotalRegularExpression;

        public string CreateRegularExpression(RegExModel model)
        {
            regexp = "";
            regText = "";

            if (model.alphabet.isAlphabet)
            {
                if (model.alphabet.atLeastOne)
                {
                    regexp=regexp+CreateFromAlphabet.FromAtLeastOne(model.alphabet);
                    regText = regText + CreateFromAlphabet.FromAtLeastOne(model.alphabet, model.alphabet.atLeastOne);

                }else 
                {
                    regText = regText + CreateFromAlphabet.FromAlphabet(model.alphabet);
                }
            }

            if (model.number.isNumber)
            {
                if (model.number.atLeastOne)
                {
                    regexp = regexp + CreateFromNumbers.FromAtLeastOne(model.number);
                    regText = regText + CreateFromNumbers.FromAtLeastOne(model.number, model.number.atLeastOne);

                }
                else
                {
                    regText = regText + CreateFromNumbers.FromNumber(model.number);
                }
            }

            if (model.special.isSpecial)
            {
                if (model.special.atLeastOne)
                {
                    regexp = regexp + CreateFromSpecialCharacter.FromAtLeast(model.special);
                    regText = regText + CreateFromSpecialCharacter.FromAtLeast(model.special, model.special.atLeastOne);

                }
                else
                {
                    regText = regText + CreateFromSpecialCharacter.FromSpecialCharacter(model.special);
                }
            }

            TotalRegularExpression = regexp + "[" + regText + "]";

            if(model.totalLength.min>0 || model.totalLength.max > 0)
            {
                if(model.totalLength.min == model.totalLength.max)
                {
                    TotalRegularExpression = TotalRegularExpression + "{" + model.totalLength.max + "}";

                }else if (model.totalLength.min > 0 && model.totalLength.max>0)
                {
                    TotalRegularExpression = TotalRegularExpression + "{" + model.totalLength.min + ","+model.totalLength.max+"}";

                }else if (model.totalLength.min > 0)
                {
                    TotalRegularExpression = TotalRegularExpression + "{" + model.totalLength.min + ",}";
                }
            }

            if (model.separation.isSeparation)
            {
                TotalRegularExpression = AddSeparation(TotalRegularExpression, model.separation.separationText);
            }else
            {
                if(model.totalLength.min>0 || model.totalLength.max > 0)
                {
                    TotalRegularExpression = TotalRegularExpression + "";
                }else
                {
                    TotalRegularExpression = TotalRegularExpression + "+";
                }
            }


            return TotalRegularExpression;

        }

        private string AddSeparation(string totalRegExp, string separationLetter)
        {
            string finalRegExp;

            if (separationLetter != null)
            {
                finalRegExp = "(" + totalRegExp + ")" + "+" + separationLetter;
            }
            else
            {
                finalRegExp = "(" + totalRegExp + ")" + "+";
            }

            

            return finalRegExp;
        }
    }
}