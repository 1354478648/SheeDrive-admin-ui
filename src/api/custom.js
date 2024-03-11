import request from '@/utils/request'

export const getWeatherService = (adcode) => {
    return request.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=c52c5c7e8241b96dc86053ae5e9a23ca`);
}

export const getGeoCodeService = (address) => {
    return request.get(`https://restapi.amap.com/v3/geocode/geo?address=${address}&key=c52c5c7e8241b96dc86053ae5e9a23ca`);
}