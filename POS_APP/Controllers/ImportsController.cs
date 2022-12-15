using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using POS_APP.Models;

namespace POS_APP.Controllers
{
    public class ImportsController : Controller
    {
        // GET: Imports
        private POS_DBEntities db = new POS_DBEntities();
        // GET: Imports
        public ActionResult Index()
        {
            ViewBag.PCode = new SelectList(db.Products, "PCode", "PName");
            ViewBag.CatId = new SelectList(db.Categories, "CatId", "CatName");
            ViewBag.SupId = new SelectList(db.Suppliers, "SupId", "SupName");
            return View();
        }
        public JsonResult GetAllData()
        {
            var imports = (from a in db.Imports
                           join b in db.Products on a.PCode equals b.PCode
                           join c in db.Categories on a.CatId equals c.CatId
                           join d in db.Suppliers on a.SupId equals d.SupId
                           select new
                           {
                               a.ImportID,
                               a.PCode,
                               a.CatId,
                               a.SupId,
                               a.ImportDate,
                               a.ImportQTY,
                               b.PName,
                               c.CatName,
                               d.SupName
                           });
            return new JsonResult { Data = imports, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult Create(Import import)
        {
            db.Imports.Add(import);
            db.SaveChanges();
            return new JsonResult { Data = "Insert Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //get by id
        public JsonResult GetDataID(int? id)
        {
            var import = (from a in db.Imports
                          join b in db.Products on a.PCode equals b.PCode
                          join c in db.Categories on a.CatId equals c.CatId
                          join d in db.Suppliers on a.SupId equals d.SupId
                          where (a.ImportID == id)
                          select new
                          {
                              a.ImportID,
                              a.PCode,
                              a.CatId,
                              a.SupId,
                              a.ImportDate,
                              a.ImportQTY,
                              b.PName,
                              c.CatName,
                              d.SupName
                          });
            return new JsonResult { Data = import, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Update
        public JsonResult Edit(Import import)
        {
            db.Entry(import).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return new JsonResult { Data = "Update Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Delete
        public JsonResult Delete(int id)
        {
            Import Import = db.Imports.Find(id);
            db.Imports.Remove(Import);
            db.SaveChanges();
            return new JsonResult { Data = "Delete Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}