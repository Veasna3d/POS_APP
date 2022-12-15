using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using POS_APP.Models;

namespace POS_APP.Controllers
{
    public class CategoriesController : Controller
    {
        private POS_DBEntities db = new POS_DBEntities();
        public ActionResult Index()
        {
            return View();
        }
        //GetAllData
        public JsonResult GetAllData()
        {
            return new JsonResult { Data = db.Categories.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Insert
        public JsonResult Create(Category category)
        {
            db.Categories.Add(category); ;
            db.SaveChanges();
            return new JsonResult { Data = "Insert Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //get by id
        public JsonResult GetDataID(int? id)
        {
            Category category = db.Categories.Find(id);
            return new JsonResult { Data = category, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Update
        public JsonResult Edit(Category category)
        {

            db.Entry(category).State = EntityState.Modified;
            db.SaveChanges();
            return new JsonResult { Data = "Update Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Delete
        public JsonResult Delete(int id)
        {
            Category category = db.Categories.Find(id);
            db.Categories.Remove(category);
            db.SaveChanges();
            return new JsonResult { Data = "Delete Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

    }
}