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

        private enum CalculationMethod : int
        {
            Binomial = 0,
            BS = 1
        }

        // Import the PriceEuropeanOption function from the C++ DLL
        [DllImport("fintech_model.dll", CallingConvention = CallingConvention.Cdecl)]
        private static extern double PriceEuropeanOption(
            OptionType type,
            CalculationMethod method,
            double expiry_time,
            int period_number,
            double volatility,
            double continuous_rf_rate,
            double initial_share_price,
            double strike_price
        );

        // Import the CalculateBSImpliedVolatility function from the C++ DLL
        [DllImport("fintech_model.dll", CallingConvention = CallingConvention.Cdecl)]
        private static extern double CalculateBSImpliedVolatility(
            double option_market_price,
            OptionType type,
            double expiry_time,
            double continuous_rf_rate,
            double strike_price,
            double initial_share_price
        );

        private static List<Option> options = new List<Option>
        {
            new Option { Id = 1, Name = "Aapl", Price = 0, Volatility = 0 }
        };

        [HttpPost("price")]
        public IActionResult CalculateOptionPrice([FromBody] OptionPricingParameters parameters)
        {
            try
            {
                // Call the DLL function with the parameters
                double optionPrice = PriceEuropeanOption(
                    parameters.Type == "call" ? OptionType.Call : OptionType.Put,
                    parameters.Method == "binomial" ? CalculationMethod.Binomial: CalculationMethod.BS,
                    parameters.ExpiryTime,
                    parameters.PeriodNumber,
                    parameters.Volatility,
                    parameters.ContinuousRfRate,
                    parameters.InitialSharePrice,
                    parameters.StrikePrice
                );

                Debug.WriteLine($"Calculated option price: {optionPrice}");

                options[0].Price = (decimal)optionPrice;
                options[0].Volatility = (decimal)parameters.Volatility;

                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpPost("volatility")]
        public IActionResult CalculateOptionVolatility([FromBody] ImpliedVolatilityParameters parameters)
        {
            try
            {
                // Call the DLL function with the parameters
                double impliedVolatiliy = CalculateBSImpliedVolatility(
                    parameters.InitialOptionPrice,
                    parameters.Type == "call" ? OptionType.Call : OptionType.Put,
                    parameters.ExpiryTime,
                    parameters.ContinuousRfRate,
                    parameters.InitialSharePrice,
                    parameters.StrikePrice
                );

                Debug.WriteLine($"Calculated implied volatility price: {impliedVolatiliy}");
                
                options[0].Price = (decimal)parameters.InitialOptionPrice;
                options[0].Volatility = (decimal)impliedVolatiliy;

                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}
