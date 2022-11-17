import { HttpRequest, HttpStatusCode } from '@/gateways'
import { AxiosHttpClient } from '@/infra/gateways'
import { mockAxios } from '@/tests/infra/mocks/mock-axios'

import axios from 'axios'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const mockHttpRequest = (): HttpRequest => ({
  url: 'any_url',
  method: 'post',
  body: { any: 'body' },
  headers: { any: 'header' }
})

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxios = mockAxios()
  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClient Adapter', () => {
  test('Should call Axios with correct values', async () => {
    const data = mockHttpRequest()
    const { sut, mockedAxios } = makeSut()

    await sut.request(data)
    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: data.url,
      method: data.method,
      data: data.body,
      headers: data.headers
    })
  })

  test('Should return correct response', async () => {
    const { sut, mockedAxios } = makeSut()
    const httpResponse = await sut.request(mockHttpRequest())
    const axiosResponse = await mockedAxios.request.mock.results[0].value

    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    })
  })

  test('Should return correct response error', async () => {
    const { sut, mockedAxios } = makeSut()
    const axiosResponse = {
      status: 400,
      data: { any: 'data' }
    }
    mockedAxios.request.mockRejectedValueOnce({
      response: axiosResponse
    })

    const httpResponse = await sut.request(mockHttpRequest())

    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      error: axiosResponse.data
    })
  })
  test('Should return correct unknown error', async () => {
    const { sut, mockedAxios } = makeSut()

    const error = new Error('any_error')
    mockedAxios.request.mockRejectedValueOnce(error)

    const httpResponse = await sut.request(mockHttpRequest())

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.unknown,
      error
    })
  })
})
