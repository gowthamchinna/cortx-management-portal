/*****************************************************************************
 Filename:          checks.ts
 Description:       validates the request parameters based on the criteria
                    mentioned in apigetparameters.json.

 Creation Date:     23/08/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/http-errors";
import * as getparams from './../api-mandatory-params.json';
import * as sortValidators from './sort-validator';
import url from "url";

let objectValue = JSON.parse(JSON.stringify(getparams));
let count = Object.keys(objectValue).length;

/**
 * This method validates the request parameters based on their mandatory criteria
 * on this API level. This API and its mandatory parameters are defined in the 
 * api_mandatory_parameters.json. 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkRequiredParams = (req: Request, res: Response, next: NextFunction) => {
  console.log("Validation is for URL: " + req.url);
  if (req.method == 'GET') {
    validateGetParams(req, res, next);
  } else if (req.method == 'PATCH') {
    validatePatchParams(req, res, next);
  } else if (req.method == 'POST') {
    validatePostParams(req, res, next);
  } else if (req.method == 'PUT') {
    validatePutParams(req, res, next);
  } else {
    next();
  }
};

/**
 * This method validates the parameters in payload of POST method.
 * This methods gets the mandatory parmeter criteria from 
 * api-mandatory-parameters.json based on the PATH.
 * @param req 
 * @param res 
 * @param next 
 */
let validatePostParams = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  let path = "";
  for (let i = 0; i < count; i++) {
    if (url.includes(Object.keys(objectValue)[i])) {
      path = Object.keys(objectValue)[i];
      break;
    }
  }
  let requiredParams = objectValue[path];
  if (requiredParams) {
    let requiredPatchParams = requiredParams.POST;
    if (requiredPatchParams) {
      validateParams(requiredPatchParams, req.body, req, res, next);
    } else {
      next();
    }
  } else {
    next();
  }
}


/**
 * This method validates the parameters in payload of PATCH method.
 * This methods gets the mandatory parmeter criteria from 
 * api-mandatory-parameters.json based on the PATH.
 * @param req 
 * @param res 
 * @param next 
 */
let validatePatchParams = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  let path = "";
  for (let i = 0; i < count; i++) {
    if (url.includes(Object.keys(objectValue)[i])) {
      path = Object.keys(objectValue)[i];
      break;
    }
  }
  let requiredParams = objectValue[path];
  if (requiredParams) {
    let requiredPatchParams = requiredParams.PATCH;
    if (requiredPatchParams) {
      validateParams(requiredPatchParams, req.body, req, res, next);
    } else {
      next();
    }
  } else {
    next();
  }
}

/**
 * This method validates the parameters in payload of PUT method.
 * This methods gets the mandatory parmeter criteria from 
 * api-mandatory-parameters.json based on the PATH.
 * @param req 
 * @param res 
 * @param next 
 */
let validatePutParams = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  let path = "";
  for (let i = 0; i < count; i++) {
    if (url.includes(Object.keys(objectValue)[i])) {
      path = Object.keys(objectValue)[i];
      break;
    }
  }
  let requiredParams = objectValue[path];
  if (requiredParams) {
    let requiredPatchParams = requiredParams.PUT;
    if (requiredPatchParams) {
      validateParams(requiredPatchParams, req.body, req, res, next);
    } else {
      next();
    }
  } else {
    next();
  }
}

/**
 * This method validates the request parameters of GET method.
 * This methods gets the mandatory parmeter criteria from 
 * api-mandatory-parameters.json based on the PATH.
 * @param req 
 * @param res 
 * @param next 
 */
let validateGetParams = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url.includes("?") ? req.url.substring(0, req.url.indexOf("?")) : req.url;
  let path = "";
  for (let i = 0; i < count; i++) {
    if (url.includes(Object.keys(objectValue)[i])) {
      path = Object.keys(objectValue)[i];
      break;
    }
  }

  let requiredGetParams = objectValue[path];
  if (requiredGetParams) {
    let requiredParams = requiredGetParams.GET;
    if (requiredParams) {
      validateParams(requiredParams, req.query, req, res, next);
    } else {
      next();
    }
  } else {
    next();
  }
}

/**
 * This method actually validates all the mandatory parameters.
 * @param requiredParams 
 * @param params 
 * @param req 
 * @param res 
 * @param next 
 */
let validateParams = (requiredParams: any, params: any, req: Request, res: Response, next: NextFunction) => {
  let validparam = true;
  let validvalues = true;
  let validparamtype = false
  let validvalidatorparam = true;
  let count = Object.keys(requiredParams).length;
  for (let i = 0; i < count; i++) {
    let requiredParam = requiredParams[i];
    if (requiredParam.required && !requiredParam.default && !params[requiredParam.paramname.trim()]) {
      validparam = false;
      break;
    }
    //Add default params to url which may be used at the time of caching
    if (!params[requiredParam.paramname.trim()] && Object.keys(requiredParam).includes("default")) {
      if (req.url && req.method == 'GET') {
        let urle = req.url;
        let url = decodeURIComponent(urle);
        let firstSeperator = (url.indexOf('?') == -1 ? '?' : '&');
        let queryStringParts = new Array();
        queryStringParts.push(requiredParam.paramname.trim() + '=' + encodeURIComponent(requiredParam.default));
        let queryString = queryStringParts.join('&');
        req.url = url + firstSeperator + queryString;
      } else {
        req.body[requiredParam.paramname.trim()] = requiredParam.default;
      }
    }

    if (params[requiredParam.paramname.trim()]) {
      let requestValue = params[requiredParam.paramname.trim()];
      if (requiredParam.values && requestValue) {
        let paramValues = requiredParam.values.split(",");
        if (!paramValues.includes(requestValue)) {
          validvalues = false;
        }
      }

      if (!validvalues) {
        break;
      }

      let datatype = requiredParam.datatype;
      if (datatype == 'boolean' && datatype == typeof requestValue) {
        validparamtype = true;
        break;
      }

      requestValue = Number(params[requiredParam.paramname.trim()]);

      if (isNaN(requestValue)) {
        requestValue = params[requiredParam.paramname.trim()];
      }

      if (!datatype || datatype == "string") {
        datatype = "string|number";
      }
      let datatypes = datatype.split("|");
      let datatypecount = Object.keys(datatypes).length;
      validparamtype = false;
      for (let j = 0; j < datatypecount; j++) {
        if (datatypes[j] == typeof requestValue) {
          validparamtype = true;
          break;
        }
      }

      if (!validparamtype || !validvalues) {
        break;
      } else {
        if (requiredParam.validators) {
          let validators = requiredParam.validators.split(",");
          let validatorscount = Object.keys(validators).length;
          for (let j = 0; j < validatorscount; j++) {
            let func = validators[j];
            let arr = new Map(Object.entries(sortValidators));
            let fun = arr.get(func);
            if (fun) {
              validvalidatorparam = fun.call(fun, req, res, next);
            }
            if (!validvalidatorparam) {
              break;
            }
          }
          if (!validvalidatorparam) {
            break;
          }
        }
      }
    } else {
      validparamtype = true;
    }
  }
  if (validparam && validparamtype && validvalidatorparam && validvalues) {
    next();
  } else if (!validparam) {
    throw new HTTP400Error("Missing required parameters");
  } else if (!validparamtype || !validvalidatorparam || !validvalues) {
    throw new HTTP400Error("Missing valid required parameters");
  } else {
    throw new HTTP400Error("Some error occurred.");
  }
}