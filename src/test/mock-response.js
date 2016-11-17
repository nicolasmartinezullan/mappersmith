import MockAssert from './mock-assert'
import Response from '../response'
import { isPlainObject } from '../utils'

function MockResponse(id, props) {
  this.id = id

  this.method = props.method || 'get'
  this.url = props.url
  this.responseData = props.response
  this.responseHeaders = props.headers || {}
  this.responseStatus = props.status || 200

  this.calls = []

  if (isPlainObject(this.responseData)) {
    this.responseData = JSON.stringify(this.responseData)
    if (!this.responseHeaders['content-type']) {
      this.responseHeaders['content-type'] = 'application/json'
    }
  }
}

MockResponse.prototype = {
  call(request) {
    this.calls.push(request)
    return new Response(
      request,
      this.responseStatus,
      this.responseData,
      this.responseHeaders
    )
  },

  assertObject() {
    return new MockAssert(this.calls)
  },

  isExactMatch(request) {
    return this.method === request.method() &&
      this.url=== request.url()
  },

  isPartialMatch(request) {
    return new RegExp(this.method).test(request.method()) &&
      new RegExp(this.url).test(request.url())
  }
}

export default MockResponse
