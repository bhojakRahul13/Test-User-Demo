function Response() {
  this.code = 200;
  this.success = true;
  this.message = "";
  this.data = [];
  this.err = [];
}

function ResponseWithPagination() {
  this.code = 200;
  this.success = true;
  this.message = "";
  this.pagination = {};
  this.data = [];
  this.err = [];
}

function successNoDataFoundResponse(message, payload) {
  let res = new Response();
  res.code = 400;
  res.success = true;
  res.message = message;
  res.data = payload;

  return res;
}

function defaultResponse(code, message, payload) {
  let res = new Response();
  res.code = code;
  res.success = true;
  res.message = message;
  res.data = payload;

  return res;
}

function successCreateResponse(message, payload) {
  let res = new Response();
  res.code = 201;
  res.success = true;
  res.message = message;
  res.data = payload;

  return res;
}

function successResponse(message, payload) {
  let res = new Response();
  res.code = 200;
  res.success = true;
  res.message = message;
  res.data = payload;

  return res;
}

function successResponsePagination(message, payload, pagination) {
  let res = new ResponseWithPagination();
  res.code = 200;
  res.success = true;
  res.message = message;
  res.pagination = pagination;
  res.data = payload;
 
  return res;
}

function notFound(message, payload) {
  let res = new Response();
  res.code = 203;
  res.success = true;
  res.message = message;
  res.data = []
  res.err = payload;

  return res;
}

function AdminAuthentication(err) {
  console.log("erer",err);
  let res = new Response();
  res.code = 401;
  res.success = false;
  res.message = "The request requires Admin authentication";
  res.data = [];
  res.err = err;
  return res;
}

function Authentication(err) {
  let res = new Response();
  res.code = 401;
  res.success = false;
  res.message = "The request requires Admin or valid user authentication";
  res.data = [];
  res.err = err;
  return res;
}

function failResponse(message, payload, err) {
  let res = new Response();
  res.code = 400;
  res.success = false;
  res.message = message;
  res.data = payload;
  res.err = err;

  return res;
}

function APIFailResponse(message, payload, err) {
  let res = new Response();
  res.code = "ETIMEDOUT";
  res.success = false;
  res.message = message;
  res.data = payload;
  res.err = err;

  return res;
}

module.exports = {
  successResponse,
  failResponse,
  successResponsePagination,
  notFound,
  successCreateResponse,
  APIFailResponse,
  successNoDataFoundResponse,
  defaultResponse,
  AdminAuthentication,
  Authentication
};
