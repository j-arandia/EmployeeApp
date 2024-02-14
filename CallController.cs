using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using HelpdeskViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace CasestudyWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CallController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                CallViewModel viewmodel = new CallViewModel();
                var allCalls = viewmodel.GetAll();
                return Ok(allCalls);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                CallViewModel vm = new CallViewModel();
                vm.Id = id;
                vm.GetById();
                return Ok(vm);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError); //something went wrong
            }
        }

        [HttpPut]
        public ActionResult Put(CallViewModel vm)
        {
            try
            {
                int revVal = vm.Update();
                return revVal switch
                {
                    1 => Ok(new { msg = "Call " + vm.Id + " updated!" }),
                    -1 => Ok(new { msg = "Call " + vm.Id + " not updated!" }),
                    -2 => Ok(new { msg = "Data is stale for " + vm.Id + ", Call not updated!" }),
                    _ => Ok(new { msg = "Call " + vm.Id + " not updated!" }),
                };
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost]
        public ActionResult Post(CallViewModel viewmodel)
        {
            try
            {
                viewmodel.Add();
                return viewmodel.Id > 1
                ? Ok(new { msg = "Call " + viewmodel.Id + " added!" })
                : Ok(new { msg = "Call " + viewmodel.Id+ "not added!" });

            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                CallViewModel viewmodel = new CallViewModel { Id = id };
                return viewmodel.Delete() == 1
                    ? Ok(new { msg = "Call " + id + " deleted!" })
                    : Ok(new { msg = "Call " + id + " not deleted!" });
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
