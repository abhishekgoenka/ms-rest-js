// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpOperationResponse } from "../httpOperationResponse";
import * as utils from "../util/utils";
import { WebResource } from "../webResource";
import { BaseRequestPolicy, RequestPolicy, RequestPolicyFactory, RequestPolicyOptions } from "./requestPolicy";

export function generateClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id"): RequestPolicyFactory {
  return {
    create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
      return new GenerateClientRequestIdPolicy(nextPolicy, options, requestIdHeaderName);
    }
  };
}

export class GenerateClientRequestIdPolicy extends BaseRequestPolicy {
  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, private _requestIdHeaderName: string) {
    super(nextPolicy, options);
  }

  public sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    if (!request.headers.contains(this._requestIdHeaderName)) {
      request.headers.set(this._requestIdHeaderName, utils.generateUuid());
    }
    return this._nextPolicy.sendRequest(request);
  }
}
