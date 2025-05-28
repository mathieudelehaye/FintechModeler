package org.example.fintechmodeler.model;

public class Option {
    private long id;
    private String name;
    private double price;
    private double volatility;

    public Option() { }

    public Option(long id, String name, double price, double volatility) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.volatility = volatility;
    }

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public double getVolatility() {
        return volatility;
    }
    public void setVolatility(double volatility) {
        this.volatility = volatility;
    }
}
