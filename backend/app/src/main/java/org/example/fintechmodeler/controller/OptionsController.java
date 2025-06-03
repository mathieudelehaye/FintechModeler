package org.example.fintechmodeler.controller;

import org.example.fintechmodeler.model.Option;
import org.example.fintechmodeler.model.OptionPricingParameters;
import org.example.fintechmodeler.model.ImpliedVolatilityParameters;
import org.example.fintechmodeler.nativeapi.FintechModelLibrary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/options")
public class OptionsController {
    private static final Logger logger = LoggerFactory.getLogger(OptionsController.class);

    // In-memory store
    private final List<Option> options = new ArrayList<>();

    public OptionsController() {
        options.add(new Option(1, "Aapl", 0.0, 0.0));
    }

    @PostMapping("/price")
    public ResponseEntity<?> calculateOptionPrice(@RequestBody OptionPricingParameters p) {
        logger.info("Received price request: {}", p);
        // Validate required fields
        if (p.getType() == null || p.getMethod() == null) {
            Map<String, String> err = Map.of("error", "'type' and 'method' fields are required");
            return ResponseEntity.badRequest().body(err);
        }
        try {
            int type = "call".equalsIgnoreCase(p.getType()) ? 0 : 1;
            int method = "binomial".equalsIgnoreCase(p.getMethod()) ? 0 : 1;

            double price = FintechModelLibrary.INSTANCE.PriceEuropeanOption(
                type, method,
                p.getExpiryTime(), p.getPeriodNumber(),
                p.getVolatility(), p.getContinuousRfRate(),
                p.getInitialSharePrice(), p.getStrikePrice()
            );

            logger.info("Computed option price: {}", price);
            Option o = options.get(0);
            o.setPrice(price);
            o.setVolatility(p.getVolatility());
            return ResponseEntity.ok(options);
        } catch (Throwable ex) {
            logger.error("Error calculating option price", ex);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("error", ex.getMessage());
            errorBody.put("trace", Arrays.toString(ex.getStackTrace()));
            return ResponseEntity.status(500).body(errorBody);
        }
    }

    @PostMapping("/volatility")
    public ResponseEntity<?> calculateOptionVolatility(@RequestBody ImpliedVolatilityParameters p) {
        logger.info("Received volatility request: {}", p);
        if (p.getType() == null) {
            Map<String, String> err = Map.of("error", "'type' field is required");
            return ResponseEntity.badRequest().body(err);
        }
        try {
            int type = "call".equalsIgnoreCase(p.getType()) ? 0 : 1;
            double iv = FintechModelLibrary.INSTANCE.CalculateBSImpliedVolatility(
                p.getInitialOptionPrice(), type,
                p.getExpiryTime(), p.getContinuousRfRate(),
                p.getStrikePrice(), p.getInitialSharePrice()
            );

            logger.info("Computed implied volatility: {}", iv);
            Option o = options.get(0);
            o.setPrice(p.getInitialOptionPrice());
            o.setVolatility(iv);
            return ResponseEntity.ok(options);
        } catch (Throwable ex) {
            logger.error("Error calculating implied volatility", ex);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("error", ex.getMessage());
            errorBody.put("trace", Arrays.toString(ex.getStackTrace()));
            return ResponseEntity.status(500).body(errorBody);
        }
    }
}
