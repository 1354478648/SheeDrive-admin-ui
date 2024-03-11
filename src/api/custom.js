import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

export const getWeatherService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/dashboard/weather${queryString}`);
}