exports.success = function (data) {
  return {
    status: 1,
    data: data
  };
}

exports.error = function (data) {
  return {
    status: 0,
    data: data
  }
}