import * as prices from "../prices"
import type * as MOCK_PRICES from "./prices"

export const pricesMock = prices as unknown as typeof MOCK_PRICES
