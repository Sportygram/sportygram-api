import axios, { AxiosError } from "axios";
import { config } from "../../../../lib/config";
import logger from "../../../../lib/core/Logger";

const { baseURL, rapidAPIKey, rapidAPIHost } = config.apiFootball;

const baseApi = axios.create({
    baseURL,
    headers: { "X-RapidAPI-Host": rapidAPIHost, "X-RapidAPI-Key": rapidAPIKey },
    // headers: { "x-apisports-key": apiSportsKey },
});

function errorHandler(error: AxiosError<any>) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        logger.info("[ApiFootballError]", {
            data: error.response.data,
            statusCode: error.response.status,
            statusText: error.response.statusText,
            request: error.config,
        });
        switch (error.response.status) {
            case 401:
            case 403:
            case 404:
            case 500:
                // TODO:Send Admin a message
                break;
            case 429:
                // set hasReachedToday's limit and notify admin
                break;
            default:
                //notify admin
                break;
        }
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        logger.error("ApiFootballError", {
            error: "request_error",
            message: error.message,
            request: error.config,
        });
        // notify admin
    } else {
        // Something happened in setting up the message that triggered an Error
        logger.error("ApiFootballError", {
            message: error.message,
            request: error.config,
        });
        // notify admin
    }
    return Promise.reject(
        new Error(
            ` ApiFootball Error: ${
                error?.response?.data?.message || error.message
            }`
        )
    );
}

export async function apiFootballRequest(endpoint: string, params = {}) {
    try {
        // check if apiFootball hasReachedToday's limit on redis
        const response = await baseApi.get<any>(endpoint, { params });
        const errorKeys = Object.keys(response.data.errors);
        if (errorKeys.length) {
            throw new Error(response.data.errors[errorKeys[0]]);
        }
        logger.info("ApiFootballSuccess", {
            request: response.config.url,
            params,
        });
        return response.data;
        // use to set hasReachedToday's limit: X-RateLimit-requests-Remaining
    } catch (error) {
        return errorHandler(error);
    }
}
