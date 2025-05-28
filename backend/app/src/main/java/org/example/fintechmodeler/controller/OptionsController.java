package org.example.fintechmodeler.controller;

import org.example.fintechmodeler.model.*;
import org.example.fintechmodeler.nativeapi.FintechModelLibrary;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/options")
public class OptionsController {

    // In-memory store (mimics your static List<Option>)
    private final List<Option> options = Collections.singletonList(
        new Option(1, "Aapl", 0.0, 0.0)
    );

    @PostMapping("/price")
    public ResponseEntity<List<Option>> calculateOptionPrice(
            @RequestBody OptionPricingParameters p) {
        try {
            int type = "call".equalsIgnoreCase(p.getType()) ? 0 : 1;
            int method = "binomial".equalsIgnoreCase(p.getMethod()) ? 0 : 1;

            double price = FintechModelLibrary.INSTANCE.PriceEuropeanOption(
                type,
                method,
                p.getExpiryTime(),
                p.getPeriodNumber(),
                p.getVolatility(),
                p.getContinuousRfRate(),
                p.getInitialSharePrice(),
                p.getStrikePrice()
            );

            Option o = options.get(0);
            o.setPrice(price);
            o.setVolatility(p.getVolatility());
            return ResponseEntity.ok(options);
        } catch (Throwable ex) {
            return ResponseEntity
                .status(500)
                .body(options); // or wrap error in a POJO
        }
    }

    @PostMapping("/volatility")
    public ResponseEntity<List<Option>> calculateOptionVolatility(
            @RequestBody ImpliedVolatilityParameters p) {
        try {
            int type = "call".equalsIgnoreCase(p.getType()) ? 0 : 1;
            double iv = FintechModelLibrary.INSTANCE.CalculateBSImpliedVolatility(
                p.getInitialOptionPrice(),
                type,
                p.getExpiryTime(),
                p.getContinuousRfRate(),
                p.getStrikePrice(),
                p.getInitialSharePrice()
            );

            Option o = options.get(0);
            o.setPrice(p.getInitialOptionPrice());
            o.setVolatility(iv);
            return ResponseEntity.ok(options);
        } catch (Throwable ex) {
            return ResponseEntity
                .status(500)
                .body(options);
        }
    }
}
