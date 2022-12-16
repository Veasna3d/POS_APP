using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using POS_APP.Models;

namespace POS_APP.Controllers
{
    public class SuppliersController : Controller
    {
        // GET: Suppliers

        private POS_DBEntities db = new POS_DBEntities();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Sup()
        {
            return View();
        }
        //GetAllData
        public JsonResult GetAllData()
        {
            return new JsonResult { Data = db.Suppliers.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Insert
        public JsonResult Create(Supplier supplier)
        {
            db.Suppliers.Add(supplier);
            db.SaveChanges();
            return new JsonResult { Data = "Insert Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //get by id
        public JsonResult GetDataID(int? id)
        {
            Supplier supplier = db.Suppliers.Find(id);
            return new JsonResult { Data = supplier, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Update
        public JsonResult Edit(Supplier supplier)
        {

            db.Entry(supplier).State = EntityState.Modified;
            db.SaveChanges();
            return new JsonResult { Data = "Update Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Delete
        public JsonResult Delete(int id)
        {
            Supplier supplier = db.Suppliers.Find(id);
            db.Suppliers.Remove(supplier);
            db.SaveChanges();
            return new JsonResult { Data = "Delete Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

    }
}