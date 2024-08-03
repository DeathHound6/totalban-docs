import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
    const pageSize =  parseInt(request.nextUrl.searchParams.get("pageSize") || "10");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const path = request.nextUrl.searchParams.get("path");
    const commit = request.nextUrl.searchParams.get("commit");

    let queryString = `?page=${page}&per_page=${pageSize}`;
    if (path)
        queryString += `&path=${path}`;
    if (commit)
        queryString += `&sha=${commit}`;

    const commitsResponse = await fetch(`https://api.github.com/repos/DeathHound6/totalban-docs/commits${queryString}`,
        {
            cache: "no-store",
            headers: {
                "Accept": "application/vnd.github+json"
            }
        }
    );

    if (commitsResponse.status == 400)
        return;
    else if (commitsResponse.status == 404)
        return;
    else if (commitsResponse.status == 409)
        return;
    else if (commitsResponse.status == 429)
        return;

    return NextResponse.json({ "meta": {}, "data": [] }, { status: 200 });
}