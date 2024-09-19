﻿using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace NovaVerse.Controllers
{
    public class Stripe : Controller
    {
        [Route("api/[controller]")]
        [ApiController]

        public class StripeController : Controller {

            [HttpPost("create-checkout-session")]
            public async Task<IActionResult> CreateCheckoutSession()
            {
                StripeConfiguration.ApiKey = "tuo-secret-key-di-stripe";

                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = 2000, // Prezzo in centesimi
                            Currency = "eur",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Acquisto opere d'arte",
                            },
                        },
                        Quantity = 1,
                    },
                },
                    Mode = "payment",
                    SuccessUrl = "http://localhost:4200/success",
                    CancelUrl = "http://localhost:4200/cancel",
                };

                var service = new SessionService();
                Session session = await service.CreateAsync(options);

                return Ok(new { sessionId = session.Id });
            }
        }
    }
}