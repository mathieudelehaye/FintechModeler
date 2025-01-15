using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace FintechModelerWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OptionsController : ControllerBase
    {
        // Import the PriceEuropeanCallOption function from the C++ DLL
        [DllImport("..\\dll\\x64\\Debug\\fintech_model.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern double PriceEuropeanCallOption(
            double expiry_time,
            int period_number,
            double volatility,
            double continuous_rf_rate,
            double initial_share_price,
            double strike_price
        );

        private static List<Option> options = new List<Option>
        {
            new Option { Id = 1, Name = "Aapl", Type = "call", Price = 0 }
        };

        // GET: api/options
        [HttpGet]
        public ActionResult<IEnumerable<Option>> Get()
        {
            // Call the PriceEuropeanCallOption function
            double optionPrice = PriceEuropeanCallOption(
                /*expiry_time=*/ 2,
                /*period_number=*/ 8,
                /*volatility=*/ 0.30,
                /*continuous_rf_rate=*/ 0.02,
                /*initial_share_price=*/ 100,
                /*strike_price=*/ 105
            );
            
            Debug.WriteLine($"Calculated option price: {optionPrice}");

            options[0].Price = (decimal)optionPrice;

            return Ok(options);
        }

        // GET: api/options/1
        [HttpGet("{id}")]
        public ActionResult<Option> Get(int id)
        {
            var option = options.FirstOrDefault(p => p.Id == id);
            if (option == null) return NotFound();
            return Ok(option);
        }

        // POST: api/options
        [HttpPost]
        public ActionResult<Option> Post([FromBody] Option newoption)
        {
            newoption.Id = options.Count + 1;
            options.Add(newoption);
            return CreatedAtAction(nameof(Get), new { id = newoption.Id }, newoption);
        }

        // PUT: api/options/1
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Option updatedoption)
        {
            var option = options.FirstOrDefault(p => p.Id == id);
            if (option == null) return NotFound();

            option.Name = updatedoption.Name;
            option.Type = updatedoption.Type;
            option.Price = updatedoption.Price;

            return NoContent();
        }

        // DELETE: api/options/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var option = options.FirstOrDefault(p => p.Id == id);
            if (option == null) return NotFound();

            options.Remove(option);

            return NoContent();
        }
    }
}
