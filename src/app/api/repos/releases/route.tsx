import { NextRequest, NextResponse } from "next/server";
import { parseLinkHeader, parseQueriesFromURL } from "../../../../../util/http";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
    const pageSize =  parseInt(request.nextUrl.searchParams.get("pageSize") || "10");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");

    const releasesResponse = await fetch(`https://api.github.com/repos/DeathHound6/TotalBan/releases?page=${page}&per_page=${pageSize}`,
        {
            cache: "no-store",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.PAT}`
            }
        }
    );
    if (releasesResponse.status == 404)
        return NextResponse.json({ "errors": [`Repository not found`] }, { status: 404 });
    else if (releasesResponse.status == 429)
        return NextResponse.json({ "errors": [`Github API Ratelimited`] }, { status: 429 });

    const data = [];
    const json = await releasesResponse.json();
    for (const item of json) {
        // TODO: Check the target branch/commit is default branch
        // This could potentially involve checking all commit hashes in default branch aswell

        if (item.draft)
            continue;

        data.push({
            "name": item.name,
            "body": item.body,
            "released": new Date(item.published_at)
        });
    }

    // Find the last page number from the request response header
    const linkHeader = parseLinkHeader(releasesResponse.headers.get("link"));
    let maxPage = page;
    if (linkHeader) {
        const last = linkHeader.last;
        if (last) {
            const queries = parseQueriesFromURL(last);
            if ("page" in queries)
                maxPage = parseInt(queries["page"] as string);
        }
    }

    return NextResponse.json({ 
        "meta": { 
            "page": page,
            "pageSize":pageSize,
            "pages": maxPage
        },
        "data": data 
    }, { status: 200 });
}