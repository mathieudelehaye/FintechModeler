import * as analytics from "../analytics"
import type * as MOCK_ANALYTICS from "./analytics"

export const analyticsMock = analytics as unknown as typeof MOCK_ANALYTICS
