using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using POS_APP.Models;

namespace POS_APP.Controllers
{
    public class UsersController : Controller
    {
        // GET: Users
        private POS_DBEntities db = new POS_DBEntities();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult UserList()
        {
            return View();
        }
        //GetAllData
        public JsonResult GetAllData()
        {
            return new JsonResult { Data = db.Users.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Insert
        public JsonResult Create(User user)
        {
            //Upload Image
            if (Request.Files.Count > 0)
            {
                var file = Request.Files[0];
                if (file != null && file.ContentLength > 0)
                {
                    var filename = Path.GetFileName(file.FileName);
                    var path = Path.Combine(Server.MapPath("~/Images/"), filename);
                    user.Image = filename;
                    file.SaveAs(path);
                }
            }
            db.Users.Add(user);
            db.SaveChanges();
            return new JsonResult { Data = "Insert Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //get by id
        public JsonResult GetDataID(int? id)
        {
            User user = db.Users.Find(id);
            return new JsonResult { Data = user, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Update
        public JsonResult Edit(User user)
        {
            if (Request.Files.Count > 0)
            {
                var file = Request.Files[0];
                if (file != null && file.ContentLength > 0)
                {
                    var filename = Path.GetFileName(file.FileName);
                    var path = Path.Combine(Server.MapPath("~/Images/"), filename);
                    user.Image = filename;
                    file.SaveAs(path);
                    db.Entry(user).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            else
            {
                //double check
                db.Entry(user).State = EntityState.Modified;
                db.Entry(user).Property(x => x.Image).IsModified = false;
                db.SaveChanges();
            }
            return new JsonResult { Data = "Update Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Delete
        public JsonResult Delete(int id)
        {
            User user = db.Users.Find(id);
            db.Users.Remove(user);
            db.SaveChanges();
            return new JsonResult { Data = "Delete Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Login
        public ActionResult Login()
        {
            Session["user"] = null;
            return View();
        }
        [HttpPost]
        public ActionResult Login(User user)
        {
           
            var result = db.Users.Where(m => m.Username == user.Username && m.Password == user.Password).FirstOrDefault();
            if (result != null)
            {

                Session["user"] = result;
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ViewBag.Message = string.Format("Username and Password is incorrect");
                return View();
            }
        }
    }
}