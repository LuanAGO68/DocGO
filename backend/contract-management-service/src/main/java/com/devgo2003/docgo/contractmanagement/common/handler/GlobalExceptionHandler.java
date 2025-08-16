package com.devgo2003.docgo.contractmanagement.common.handler;

import com.devgo2003.docgo.contractmanagement.common.response.ErrorDetail;
import com.devgo2003.docgo.contractmanagement.common.response.ErrorResponse;
import com.devgo2003.docgo.contractmanagement.common.response.RestResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<ErrorResponse>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<ErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> ErrorDetail.builder()
                        .field(error.getField())
                        .rejectedValue(error.getRejectedValue())
                        .message(error.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        String description = "Hệ thống phát hiện dữ liệu nhập chưa hợp lệ. Cụ thể: " +
                errors.stream()
                        .map(e -> String.format("trường '%s' được cung cấp có giá trị '%s', nhưng thông báo lỗi là '%s'", e.getField(), e.getRejectedValue(), e.getMessage()))
                        .collect(Collectors.joining(". ")) + ".";

        RestResponse<ErrorResponse> response = RestResponse.<ErrorResponse>builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .shortMessage("Có một số trường bị lỗi")
                .description(description)
                .data(ErrorResponse.builder().errors(errors).build())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
