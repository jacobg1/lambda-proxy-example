export interface GetObjectUrlResponse {
  getUrl: string;
}

export interface GetUploadUrlResponse {
  putUrl: string;
}

export interface RequestBody {
  fileName?: string;
}

export interface QsParams {
  fileName?: string;
}
