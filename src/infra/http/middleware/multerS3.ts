import {
    uploadFile,
    deleteFile,
} from "../../../lib/services/aws/awsS3Service";

const contentTypeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "text/csv": "csv",
    "application/pdf": "pdf",
};

function S3Storage(this: any, opts: { key: string }) {
    this.key = opts.key;
}

S3Storage.prototype._handleFile = function _handleFile(
    _req: any,
    file: any,
    cb: any
) {
    const extension = contentTypeMap[file.mimetype as string];
    const extWithDot = extension ? `.${extension}` : "";

    uploadFile(`${this.key}${extWithDot}`, file.stream)
        .then((url) => cb(null, { url }))
        .catch((err) => cb(err));
};

S3Storage.prototype._removeFile = function _removeFile(
    _req: any,
    file: any,
    _cb: any
) {
    const extension = contentTypeMap[file.mimetype as string];
    const extWithDot = extension ? `.${extension}` : "";
    deleteFile(`${this.key}${extWithDot}`);
};

export function createS3Storage(opts: any): any {
    return new (S3Storage as any)(opts);
}

export default createS3Storage;
