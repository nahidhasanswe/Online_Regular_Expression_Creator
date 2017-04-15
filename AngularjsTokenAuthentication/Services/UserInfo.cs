using AngularjsTokenAuthentication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngularjsTokenAuthentication.Services
{
    public class UserInfo
    {
        public UserProfile getUser(string Email)
        {
            MyDbContext db = new MyDbContext();
            UserProfile user = db.UserProfile.Where(u => u.Email == Email).SingleOrDefault();

            return user;
        }
    }
}