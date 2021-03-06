var request = require('client-request')

function Client (options) {
  this.options = options || {}
  this.endpoint = this.options.endpoint || 'http://www3.inegi.org.mx'
  this.category = this.options.category || 'todos'
  this.close = this.options.close || 500
  this.key = process.env.INEGI_API_TOKEN
}

Client.prototype._request = function (position, method, callback) {
  var uri = this.endpoint + '/sistemas/api/denue/v1/consulta/buscar/' + this.category + '/' + position + '/' + this.close + '/' + this.key

  request({
    uri: uri,
    method: method,
    json: true
  }, function (err, res, body) {
    if (err) return callback(err)

    if (res.statusCode !== 200) return callback(new Error({code: res.statusCode, message: 'Bad Request'}))

    callback(null, body)
  })
}

Client.prototype.places = function (latitude, longitude, options, callback) {
  if (options && options.close) {
    this.close = options.close
  } else {
    callback = options
  }
  var position = latitude + ',' + longitude
  this._request(position, 'GET', callback)
}

Client.prototype.search = function (place, latitude, longitude, options, callback) {
  if (options && options.close) {
    this.close = options.close
  } else {
    callback = options
  }

  if (place === undefined || place === null || place === '') return callback(new Error('Missing required parameter to search'))
  this.category = place

  var position = latitude + ',' + longitude
  this._request(position, 'GET', callback)
}

module.exports = Client
