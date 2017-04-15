using AngularjsTokenAuthentication.App_Code;
using AngularjsTokenAuthentication.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AngularjsTokenAuthentication.Controllers
{
    [RoutePrefix("api/RegularExpression")]
    public class RegExpController : ApiController
    {
        private MyDbContext db = new MyDbContext();

        [HttpPost]
        [Authorize]
        [Route("GiveRequirements")]
        public IHttpActionResult GiveRegInfo([FromBody] List<RegExModel> modelList)
        {
            string finalRegularExpression = "";

            if (modelList == null)
            {
                return BadRequest("Requirement can not be null");
            }

            RegularExpression experssion = new RegularExpression();

           foreach(RegExModel model in modelList)
            {
                finalRegularExpression = finalRegularExpression + experssion.CreateRegularExpression(model);
            }

            return Ok("^"+finalRegularExpression+"$");
        }

        [HttpPost]
        [Authorize]
        [Route("SaveRegularExpression")]
        public async Task<IHttpActionResult> Save([FromBody] RegStore model)
        {
            if(ModelState.IsValid)
            {
                model.Id= Guid.NewGuid();
                model.Email =User.Identity.GetUserName();

                db.RegStore.Add(model);
                db.SaveChanges();

                return Ok();
            }

            return BadRequest();
            
        }

        [HttpPost]
        [Authorize]
        [Route("UpdateRegularExpression")]
        public async Task<IHttpActionResult> Update([FromBody] RegStore model)
        {
            if (ModelState.IsValid)
            {
                var Username = User.Identity.GetUserName();
                model.Email = Username;
                db.Entry(model).State = EntityState.Modified;
                db.SaveChanges();
            }

           return Ok();
        }

        [HttpGet]
        [Authorize]
        [Route("RemoveRegularExpression/{id}")]
        public async Task<IHttpActionResult> Remove(System.Guid id)
        {
            RegStore model = db.RegStore.Where(m=>m.Id==id).FirstOrDefault();
            db.RegStore.Remove(model);
            db.SaveChanges();

            return Ok();
        }


        [HttpGet]
        [Authorize]
        [Route("GetRegularExpression")]
        public IHttpActionResult GetAll()
        {
            var userName = User.Identity.GetUserName();
            var modelList = db.RegStore.Where(m => m.Email == userName).Select(s=> new {
                Id=s.Id,
                Email=s.Email,
                Title=s.Title,
                Description=s.Description,
                RegExp=s.RegExp
            }).ToList();



            return Ok(modelList);
        }


        [HttpGet]
        [Authorize]
        [Route("GetRegularExpressionById/{id}")]
        public IHttpActionResult GetSignle(System.Guid id)
        {
            var userName = User.Identity.GetUserName();
            var modelList = db.RegStore.Where(m => m.Email == userName && m.Id==id).Select(s => new {
                Id = s.Id,
                Email = s.Email,
                Title = s.Title,
                Description = s.Description,
                RegExp = s.RegExp
            }).FirstOrDefault();



            return Ok(modelList);
        }

    }
}
