export interface ReleaseModel {
    name: string;
    body: string;
    released: Date;
}

export interface ReleasesResponseModel extends HTTPResponseModel {
    data: ReleaseModel[];
}