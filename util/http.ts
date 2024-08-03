interface LinkHeader {
    prev: string | undefined;
    next: string | undefined;
    first: string | undefined;
    last: string | undefined;
}

export function parseLinkHeader(header: string | null): LinkHeader | null {
    if (!header)
        return null;

    const values: LinkHeader = {
        next: undefined,
        prev: undefined,
        first: undefined,
        last: undefined
    };

    const links = header.split(", ");
    for (const link of links) {
        const [url, rel] = link.split("; ");
        if (rel == `rel="last"`)
            values.last = url.replace("<", "").replace(">", "");
        else if (rel == `rel="first"`)
            values.first = url.replace("<", ""). replace(">", "");
        else if (rel == `rel="prev"`)
            values.prev = url.replace("<", ""). replace(">", "");
        else if (rel == `rel="next"`)
            values.next = url.replace("<", ""). replace(">", "");
    }

    return values;
}

interface UrlQueries {
    [key: string]: string | string[];
}

export function parseQueriesFromURL(url: string): UrlQueries {
    const queries: UrlQueries = {};

    const [_, queryString] = url.split("?");
    if (queryString) {
        const queryArray = queryString.split("&");
        for (const query of queryArray) {
            const [name, value] = query.split("=");
            if (name in queries) {
                if (queries[name] instanceof Array)
                    queries[name].push(value);
                else
                    queries[name] = [queries[name], value];
            } else
                queries[name] = value;
        }
    }

    return queries;
}