using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using POS_APP.Models;

namespace POS_APP.Controllers
{
    public class SalesController : Controller
    {
        // GET: Sales
        private POS_DBEntities db = new POS_DBEntities();
        // GET: Sales
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetProducts(string search)
        {
            if (!String.IsNullOrEmpty(search))
            {
                return new JsonResult
                {
                    Data = db.Products.Where(s => s.PName.Contains(search)),
                    JsonRequestBehavior =
               JsonRequestBehavior.AllowGet
                };
            }
            return new JsonResult
            {
                Data = db.Products.ToList(),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        //SaveAll
        public JsonResult SaveAll(Sale[] arr)
        {
            foreach (var sale in arr)
            {
                sale.SaleDate = DateTime.Now;
                db.Sales.Add(sale);
                db.SaveChanges();
            }
            return new JsonResult { Data = "Sale Success!!", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}