package org.example.fintechmodeler.model;

public class OptionPricingParameters {
    private String type;            // "call" or "put"
    private String method;          // "binomial" or "bs"
    private double expiryTime;
    private int periodNumber;
    private double volatility;
    private double continuousRfRate;
    private double initialSharePrice;
    private double strikePrice;

    public OptionPricingParameters() { }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getMethod() {
        return method;
    }
    public void setMethod(String method) {
        this.method = method;
    }
    public double getExpiryTime() {
        return expiryTime;
    }
    public void setExpiryTime(double expiryTime) {
        this.expiryTime = expiryTime;
    }
    public int getPeriodNumber() {
        return periodNumber;
    }
    public void setPeriodNumber(int periodNumber) {
        this.periodNumber = periodNumber;
    }
    public double getVolatility() {
        return volatility;
    }
    public void setVolatility(double volatility) {
        this.volatility = volatility;
    }
    public double getContinuousRfRate() {
        return continuousRfRate;
    }
    public void setContinuousRfRate(double continuousRfRate) {
        this.continuousRfRate = continuousRfRate;
    }
    public double getInitialSharePrice() {
        return initialSharePrice;
    }
    public void setInitialSharePrice(double initialSharePrice) {
        this.initialSharePrice = initialSharePrice;
    }
    public double getStrikePrice() {
        return strikePrice;
    }
    public void setStrikePrice(double strikePrice) {
        this.strikePrice = strikePrice;
    }
}
