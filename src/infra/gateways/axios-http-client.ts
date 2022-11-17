import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode } from '../../gateways'
import axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpClient {
  async request (data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse
    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers
      })
    } catch (error: any) {
      if (error.response) {
        return {
          statusCode: error.response.status,
          error: error.response.data
        }
      }
      return {
        statusCode: HttpStatusCode.unknown,
        error
      }
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }
}
