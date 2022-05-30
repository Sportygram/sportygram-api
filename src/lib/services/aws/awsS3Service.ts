import { config } from "../../config";
import logger from "../../core/Logger";
import AWS from "aws-sdk";

const { s3BucketName } = config.aws;
const REGION = "eu-west-1";

const s3 = new AWS.S3({ apiVersion: "2012-11-05", region: REGION });

export async function uploadFile(key: string, body: any, contentType?: string) {
    try {
        const uploadParams = {
            Bucket: s3BucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
            ACL: "public-read",
        };
        const data = await s3.upload(uploadParams).promise();
        logger.info(`AWS_S3_SUCCESS: ${key}`, {
            data,
            process: "upload",
        });
        return data.Location;
    } catch (err) {
        logger.error("AWS_S3_ERROR", { err, process: "upload" });
        throw err;
    }
}

export async function deleteFile(key: string) {
    try {
        const data = await s3
            .deleteObject({ Bucket: s3BucketName, Key: key })
            .promise();
        logger.info(
            `Successfully deleted object: ${s3BucketName}/${key}`,
            data
        );
        return;
    } catch (err) {
        logger.error("AWS_S3_ERROR", { err, process: "delete" });
        throw err;
    }
}
