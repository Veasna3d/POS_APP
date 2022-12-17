using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using POS_APP.Models;

namespace POS_APP.Controllers
{
    public class ReportsController : Controller
    {
       // GET: Reports
        private POS_DBEntities db = new POS_DBEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SaleReport()
        {
            return View();
        }
        public ActionResult StockReport()
        {
            return View();
        }

        //SaleProduct
        public JsonResult SaleProduct(DateTime date1, DateTime date2)
        {
            var result = from a in db.Products
                         join b in db.Sales on a.PCode equals b.PCode
                         where b.SaleDate >= date1 && b.SaleDate <= date2
                         select new
                         {
                             b.SaleID,
                             b.SaleDate,
                             a.PName,
                             b.SalePrice,
                             b.SaleQty
                         };
            return new JsonResult { Data = result, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



        //Remain
        public JsonResult RemainByQTY()
        {
            var Imports = from a in db.Products
                          join b in db.Imports on a.PCode equals b.PCode
                          group b by new { a.PCode, a.PName } into g
                          select new
                          {
                              PCode = g.Key.PCode,
                              PName = g.Key.PName,
                              TotalQTY = g.Sum(x => x.ImportQTY)
                          };
            var Sales = from a in db.Products
                        join b in db.Sales on a.PCode equals b.PCode
                        group b by new { a.PCode, a.PName } into g
                        select new
                        {
                            PCode = g.Key.PCode,
                            PName = g.Key.PName,
                            TotalQTY = g.Sum(x => x.SaleQty)
                        };
            var result = from a in Imports
                         join b in Sales on a.PCode equals b.PCode
                         select new
                         {
                             a.PCode,
                             a.PName,
                             Import = a.TotalQTY,
                             SaleOut = b.TotalQTY,
                             Remain = a.TotalQTY - b.TotalQTY
                         };
            return new JsonResult { Data = result, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}
    
