package com.devgo2003.docgo.contractmanagement.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestResponse<T> {
    private int statusCode;
    private String shortMessage;
    private String description;
    private T data;
    private ZonedDateTime timestamp;
}
