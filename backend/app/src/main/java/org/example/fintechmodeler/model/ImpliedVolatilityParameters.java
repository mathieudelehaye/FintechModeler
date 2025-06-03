package org.example.fintechmodeler.model;

public class ImpliedVolatilityParameters {
    private double initialOptionPrice;
    private String type;            // "call" or "put"
    private double expiryTime;
    private double continuousRfRate;
    private double initialSharePrice;
    private double strikePrice;

    public ImpliedVolatilityParameters() { }

    public double getInitialOptionPrice() {
        return initialOptionPrice;
    }
    public void setInitialOptionPrice(double initialOptionPrice) {
        this.initialOptionPrice = initialOptionPrice;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public double getExpiryTime() {
        return expiryTime;
    }
    public void setExpiryTime(double expiryTime) {
        this.expiryTime = expiryTime;
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
