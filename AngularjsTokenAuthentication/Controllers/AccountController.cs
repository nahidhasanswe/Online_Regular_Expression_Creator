using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using AngularjsTokenAuthentication.Models;
using AngularjsTokenAuthentication.Providers;
using AngularjsTokenAuthentication.Results;
using AngularjsTokenAuthentication.App_Code;
using AngularjsTokenAuthentication.Services;
using System.Net;

namespace AngularjsTokenAuthentication.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }



        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);
            
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [Route("Logout")]
        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            var result = await UserManager.UpdateSecurityStampAsync(User.Identity.GetUserId());

            if(result.Succeeded)
            {
                return Ok("Logout Successfully");
            }else
            {
                ModelState.AddModelError("Error", "Internal Problem");
                return BadRequest(ModelState);
            }
        }
        
        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user, model.Password);
            bool res = SetUserName(model);

            if (!result.Succeeded ||!res)
            {
                return GetErrorResult(result);
            }
            else
            {
                try
                {
                    var code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    code = WebUtility.UrlEncode(code);
                    var url = "http://localhost:52301/#/ConfirmEmail?userId=" + user.Id + "&code=" + code;

                    await UserManager.SendEmailAsync(user.Id, "Confirm Email", "Please confirm your account by clicking <a href=\"" + new Uri(url) + "\">here</a>");
                    return Ok();
                }
                catch
                {
                    ModelState.AddModelError("Internal", "Internal Server Problem. Please try later");
                    return BadRequest(ModelState);
                }
            }

        }

        public async Task<IHttpActionResult> ResendConfirmMail(ForgotPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(model.Email);
                if(user==null)
                {
                    ModelState.AddModelError("Error","The user is not exist");
                    return BadRequest(ModelState);
                }

                try
                {
                    
                    var code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    code = WebUtility.UrlEncode(code);
                    var url = "http://localhost:52301/#/ConfirmEmail?userId=" + user.Id + "&code=" + code;

                    await UserManager.SendEmailAsync(user.Id, "Confirm Email", "Please confirm your account by clicking <a href=\"" + new Uri(url) + "\">here</a>");
                    return Ok();
                }
                catch
                {
                    ModelState.AddModelError("Internal", "Internal Server Problem. Please try later");
                    return BadRequest(ModelState);
                }
            }
            return BadRequest(ModelState);
        }

        [Route("ConfirmEmail")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> ConfirmEmail(string userId,string code)
        {
            if (userId == null || code == null)
            {
                ModelState.AddModelError("Error", "userId or code is empty");
                return BadRequest(ModelState);
            }

            //code = WebUtility.UrlDecode(code);

            var user = await UserManager.IsEmailConfirmedAsync(userId);

            if (user)
            {
                ModelState.AddModelError("Error", "The Email is already verified");
                return BadRequest(ModelState);
            }

            var result = await UserManager.ConfirmEmailAsync(userId, code);
            if (!result.Succeeded)
            {
                ModelState.AddModelError("Error", "user or token is invalid");
                return BadRequest(ModelState);
            }
            else
            {
                return Ok();
            }
        }

        
        [Route("ForgotPassword")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> ForgotPassword(ForgotPasswordModel model)
        {
            if(ModelState.IsValid)
            {
                var user = await UserManager.FindByNameAsync(model.Email);
                if(user==null|| !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    ModelState.AddModelError("Error", "User is not exist or you have not confirm your Email");
                    return BadRequest(ModelState);
                }
                try
                {
                    var code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                    code = WebUtility.UrlEncode(code);
                    var url = "http://localhost:52301/#/ResetPassword?id="+user.Id+"&code="+code;
                    
                    await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" +new Uri(url)+ "\">here</a>");
                    return Ok();
                }catch
                {
                    ModelState.AddModelError("Internal", "Internal Server Problem. Please try later");
                    return BadRequest(ModelState);
                }
            }

            return BadRequest(ModelState);
        }

        [Route("ResetPassword")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByIdAsync(model.id);
                if (user == null)
                {
                    ModelState.AddModelError("Error", "User is not exist");
                    return BadRequest(ModelState);
                }


                var result = await UserManager.ResetPasswordAsync(user.Id,model.code, model.NewPassword);
                if (result.Succeeded)
                {
                    return Ok();
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("Error", error);
                }
            }
            return BadRequest(ModelState);
        }

        public bool SetUserName(RegisterBindingModel register)
        {
            MyDbContext db = new MyDbContext();
            UserProfile user = new UserProfile();

            user.Email = register.Email;
            user.Name = register.Name;
            user.Image = "Logo/User-icon.png";


            try
            {
                db.UserProfile.Add(user);
                db.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
