import type { ReleasesResponseModel, ReleaseModel } from "../../../util/models/release";
import { ReleaseCardComponent } from "../../../components/releaseCard";
import { useState } from "react";
import useSWR from "swr";

const pageSize = 10;

export default async function ChangeLogsPage() {
    const [currentPage, setPage] = useState(0);

    function GetReleases() {
        const { data, error, isLoading }: { data: ReleasesResponseModel, isLoading: boolean, error: Error|undefined } = useSWR(
            `/api/repos/releases?page=${currentPage + 1}&pageSize=${pageSize}`,
            (...args) => fetch(...args).then((res) => res.json()),
            {}
        );

        if (!error)
            setPage(currentPage + 1);

        // eslint-disable-next-line react/jsx-key
        return data.data.map((release: ReleaseModel) => <ReleaseCardComponent release={release} />);
    }

    return (
        <div className="container">
            <div id="releases-list">
                {/* Load the first page when page loads */ GetReleases()}
            </div>
            <button onClick={() => [] /* Return response of GetReleases here */}></button>
        </div>
    );
}