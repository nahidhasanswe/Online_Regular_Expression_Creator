using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngularjsTokenAuthentication.Models
{
    public class RegExModel
    {
        public AlphabetSection alphabet { get; set; }
        public NumberSection number { get; set; }
        public SpecialSection special { get; set; }
        public SeparationSection separation { get; set; }
        public TotalLengthSection totalLength { get; set; }

    }

    public class AlphabetSection
    {
        public bool isAlphabet { get; set; }
        public bool atLeastOne { get; set; }
        public bool atLeastOneCapital { get; set; }
        public bool atLeastOneSmall { get; set; }
        public string category { get; set; }
        public string customAlphabet { get; set; }
        public string customText { get; set; }
        public int max { get; set; }
        public int min { get; set; }
    }

    public class NumberSection
    {
        public bool isNumber { get; set; }
        public bool atLeastOne { get; set; }
        public string category { get; set; }
        public string customNumber { get; set; }
        public int max { get; set; }
        public int min { get; set; }
    }

    public class SpecialSection
    {
        public bool isSpecial { get; set; }
        public bool atLeastOne { get; set; }
        public string category { get; set; }
        public string customText { get; set; }
        public int max { get; set; }
        public int min { get; set; }
    }

    public class TotalLengthSection
    {
        public int max { get; set; }
        public int min { get; set; }

    }

    public class SeparationSection
    {
        public bool isSeparation { get; set; }
        public string separationText { get; set; }

    }

    public class RegExpJson
    {
        public string finalRegularExp { get; set; }
    }

}