package com.devgo2003.docgo.contractmanagement.common.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Schema for validation error response")
public class ValidationErrorResponse extends RestResponse<ErrorResponse> {
}
