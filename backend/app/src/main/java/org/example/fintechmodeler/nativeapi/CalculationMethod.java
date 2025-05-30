package org.example.fintechmodeler.nativeapi;

public enum CalculationMethod {
    Binomial(0),
    BS(1);

    private final int value;

    CalculationMethod(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
} 