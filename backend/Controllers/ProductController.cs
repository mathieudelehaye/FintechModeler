using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Mvc;
using RESTWebService.Models;
using System.Diagnostics;

namespace RESTWebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        // Import the Add function from the C++ DLL
        [DllImport("C:\\Users\\mathi\\source\\c++\\FintechModeler\\backend\\bin\\Debug\\dependencies\\fintech_model.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Add(int a, int b);

        // Import the GetMessage function from the C++ DLL
        [DllImport("C:\\Users\\mathi\\source\\c++\\FintechModeler\\backend\\bin\\Debug\\dependencies\\fintech_model.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr GetMessage();

        private static List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Price = 1000 },
            new Product { Id = 2, Name = "Smartphone", Price = 500 },
        };

        // GET: api/products
        [HttpGet]
        public ActionResult<IEnumerable<Product>> Get()
        {
            // Call the Add function
            int result = Add(5, 10);
            Debug.WriteLine($"mdl The sum is: {result}");

            // Call the GetMessage function
            IntPtr ptr = GetMessage();
            string message = Marshal.PtrToStringAnsi(ptr);
            Debug.WriteLine($"mdl Message from C++: {message}");

            return Ok(products);
        }

        // GET: api/products/1
        [HttpGet("{id}")]
        public ActionResult<Product> Get(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // POST: api/products
        [HttpPost]
        public ActionResult<Product> Post([FromBody] Product newProduct)
        {
            newProduct.Id = products.Count + 1;
            products.Add(newProduct);
            return CreatedAtAction(nameof(Get), new { id = newProduct.Id }, newProduct);
        }

        // PUT: api/products/1
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Product updatedProduct)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            product.Name = updatedProduct.Name;
            product.Price = updatedProduct.Price;

            return NoContent();
        }

        // DELETE: api/products/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            products.Remove(product);

            return NoContent();
        }
    }
}
