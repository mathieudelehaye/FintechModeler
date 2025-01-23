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
        private enum OptionType : int
        {
            Call = 0,
            Put = 1
        }

        // Import the PriceEuropeanOption function from the C++ DLL
        [DllImport("fintech_model.dll", CallingConvention = CallingConvention.Cdecl)]
        private static extern double PriceEuropeanOption(
            OptionType type,
            double expiry_time,
            int period_number,
            double volatility,
            double continuous_rf_rate,
            double initial_share_price,
            double strike_price
        );

        private static List<Option> options = new List<Option>
        {
            new Option { Id = 1, Name = "Aapl", Price = 0 }
        };

        // GET: api/options
        [HttpGet]
        public ActionResult<IEnumerable<Option>> Get()
        {
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

        [HttpPost("price")]
        public IActionResult CalculateOptionPrice([FromBody] OptionPricingParameters parameters)
        {
            try
            {
                // Call the DLL function with the parameters
                double optionPrice = PriceEuropeanOption(
                    parameters.Type == "call" ? OptionType.Call : OptionType.Put,
                    parameters.ExpiryTime,
                    parameters.PeriodNumber,
                    parameters.Volatility,
                    parameters.ContinuousRfRate,
                    parameters.InitialSharePrice,
                    parameters.StrikePrice
                );

                Debug.WriteLine($"Calculated option price: {optionPrice}");

                options[0].Price = (decimal)optionPrice;

                return Ok(options);
            }
            catch (Exception ex)
            {
                // Handle exceptions and return an error response
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // PUT: api/options/1
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Option updatedoption)
        {
            var option = options.FirstOrDefault(p => p.Id == id);
            if (option == null) return NotFound();

            option.Name = updatedoption.Name;
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
