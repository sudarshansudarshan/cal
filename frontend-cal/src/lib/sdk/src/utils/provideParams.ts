/**
 * Utility function to provide parameters to an API route.
 * If no parameters are provided, the route is returned as-is.
 * @param route - The API route string with placeholders.
 * @param params - (Optional) Key-value pairs to replace placeholders.
 * @returns The route with placeholders replaced by actual values or the original route if no params are provided.
 */
export const provideParams = (route: string, params?: Record<string, string | number>): string => {
  if (!params) {
    return route; // Return the route as-is if no params are provided
  }

  let replacedRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    replacedRoute = replacedRoute.replace(`{${key}}`, value.toString());
  });
  return replacedRoute;
};
