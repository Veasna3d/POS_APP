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
    public class ProductsController : Controller
    {
        private POS_DBEntities db = new POS_DBEntities();
        public ActionResult Index()
        {
            return View();
        }
        //GetAllData
        public JsonResult GetAllData()
        {
            return new JsonResult
            {
                Data = db.Products.ToList(),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        //Insert
        public JsonResult Create(Product product)
        {
            //Upload Image
            if (Request.Files.Count > 0)
            {
                var file = Request.Files[0];
                if (file != null && file.ContentLength > 0)
                {
                    var filename = Path.GetFileName(file.FileName);
                    var path = Path.Combine(Server.MapPath("~/Images/"), filename);
                    product.Picture = filename;
                    file.SaveAs(path);
                }
            }
            db.Products.Add(product);
            db.SaveChanges();
            return new JsonResult { Data = "Insert Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //get by id
        public JsonResult GetDataID(int? id)
        {
            Product product = db.Products.Find(id);
            return new JsonResult { Data = product, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Update
        public JsonResult Edit(Product product)
        {
            if (Request.Files.Count > 0)
            {
                var file = Request.Files[0];
                if (file != null && file.ContentLength > 0)
                {
                    var filename = Path.GetFileName(file.FileName);
                    var path = Path.Combine(Server.MapPath("~/Images/"), filename);
                    product.Picture = filename;
                    file.SaveAs(path);
                    db.Entry(product).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            else
            {
                db.Entry(product).State = EntityState.Modified;
                db.Entry(product).Property(x => x.Picture).IsModified = false;
                db.SaveChanges();
            }
            return new JsonResult { Data = "Update Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        //Delete
        public JsonResult Delete(int id)
        {
            Product product = db.Products.Find(id);
            db.Products.Remove(product);
            db.SaveChanges();
            return new JsonResult { Data = "Delete Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}