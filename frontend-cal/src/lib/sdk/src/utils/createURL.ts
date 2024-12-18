export const createURL = (route: string, path_param?: any, query_params?: Record<string, string | number>): string => {
    let replacedRoute = route;

    if (path_param) {
        replacedRoute = replacedRoute + path_param + '/';
    }

    if (query_params) {
        const queryParts: string[] = [];

        for (const key in query_params) {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(query_params[key])}`);
        }

        const queryString = queryParts.join('&');

        if (queryString) {
            replacedRoute = replacedRoute + '?' + queryString;
        }
    }

    return replacedRoute;
}