# Tài liệu API Quản lý Hợp đồng (Contract Management)

Đây là tài liệu hướng dẫn sử dụng và kiểm thử cho các API liên quan đến việc quản lý hợp đồng trong hệ thống.

---

## 1. Tạo Hợp đồng mới

### API Endpoint

**`POST`** `/api/v1/contract-management-service/contracts`

### Description

API này được sử dụng để tạo một hợp đồng mới trong hệ thống. Khi được tạo, hợp đồng sẽ có trạng thái mặc định là `DRAFT`. Các trường quan trọng như `id`, `version`, `createdAt`, `status` và `systemId` sẽ do hệ thống tự động khởi tạo. Người dùng chỉ cần cung cấp các thông tin cần thiết cho hợp đồng.

**Lưu ý quan trọng cho tester:** Backend đã xử lý việc tự động gán `id = null` trước khi lưu, vì vậy kể cả khi client gửi lên "id": 0 hoặc "id": null, hệ thống vẫn sẽ tạo ra một bản ghi mới và không gây ra lỗi `ObjectOptimisticLockingFailureException` hay `PropertyValueException`.

### Request Body

- **Content-Type**: `application/json`
- **Trường bắt buộc**: `title`, `creatorId`.
- **Trường tùy chọn**: `expiryDate`, `partiesJson`.

**Ví dụ Request Body (Tạo thành công):**

```json
{
  "title": "Hợp đồng Dịch vụ Tư vấn Pháp lý Quý 4/2025",
  "expiryDate": "2025-12-31",
  "partiesJson": "{\"ben_cung_cap\":\"Công ty Luật ABC\",\"ben_su_dung\":\"Tập đoàn XYZ\"}",
  "creatorId": 101
}
```

### Response Body

**Response khi thành công (Code `200 OK`):**

Trả về toàn bộ đối tượng `Contract` vừa được tạo, bao gồm cả các trường do hệ thống sinh ra như `id`, `version`, `createdAt`.

```json
{
    "id": 1,
    "title": "Hợp đồng Dịch vụ Tư vấn Pháp lý Quý 4/2025",
    "status": "DRAFT",
    "createdAt": "2025-08-16T10:00:00Z",
    "expiryDate": "2025-12-31",
    "partiesJson": "{\"ben_cung_cap\":\"Công ty Luật ABC\",\"ben_su_dung\":\"Tập đoàn XYZ\"}",
    "systemId": "system1",
    "creatorId": 101,
    "version": 0
}
```

**Response khi thất bại (Code `400 Bad Request`):**

Trả về cấu trúc lỗi chi tiết khi dữ liệu đầu vào không hợp lệ.

```json
{
    "statusCode": 400,
    "shortMessage": "Có một số trường bị lỗi",
    "description": "Hệ thống phát hiện dữ liệu nhập chưa hợp lệ. Cụ thể: trường 'title' được cung cấp có giá trị '', nhưng thông báo lỗi là 'Tiêu đề không được để trống'.",
    "data": {
        "errors": [
            {
                "field": "title",
                "rejectedValue": "",
                "message": "Tiêu đề không được để trống"
            }
        ]
    },
    "timestamp": "2025-08-16T10:05:00Z"
}
```

### Test Instructions / Notes

1.  **Kiểm tra trường hợp thành công (Happy Path):**
    -   Gửi request với đầy đủ các trường bắt buộc (`title`, `creatorId`).
    -   Kiểm tra response trả về có `id` khác null, `status` là `DRAFT`, và `version` là `0`.

2.  **Kiểm tra validation cho các trường bắt buộc:**
    -   **`title` rỗng:** Gửi request với `"title": ""`. Mong muốn nhận được lỗi 400 với message `Tiêu đề không được để trống`.
    -   **`creatorId` null:** Gửi request không có trường `creatorId`. Mong muốn nhận được lỗi 400 với message `ID người tạo không được để trống`.

3.  **Kiểm tra validation cho các trường có điều kiện:**
    -   **`expiryDate` trong quá khứ:** Gửi request với `"expiryDate": "2020-01-01"`. Mong muốn nhận được lỗi 400 với message `Ngày hết hạn phải là ngày hiện tại hoặc tương lai`.

4.  **Kiểm tra việc bỏ qua các trường do hệ thống quản lý:**
    -   Gửi request có chứa `"id": 123`, `"version": 5`, `"status": "ACTIVE"`.
    -   Kiểm tra xem trong response trả về, các giá trị này có bị ghi đè bởi giá trị của hệ thống không (`id` mới, `version` là `0`, `status` là `DRAFT`).

---

## 2. Cập nhật Hợp đồng

### API Endpoint

**`PUT`** `/api/v1/contract-management-service/contracts/{id}`

### Description

Cập nhật thông tin của một hợp đồng đã tồn tại. API này sử dụng cơ chế **Optimistic Locking** thông qua trường `version`. Mỗi lần cập nhật thành công, `version` sẽ tự động tăng lên. Để cập nhật, client **phải** gửi kèm `version` của lần đọc gần nhất. Nếu `version` không khớp, hệ thống sẽ trả về lỗi `409 Conflict` để tránh ghi đè dữ liệu.

### Request Body

- **Content-Type**: `application/json`
- **Trường bắt buộc**: `title`, `creatorId`, `version`.

**Ví dụ Request Body:**

```json
{
  "title": "Hợp đồng Dịch vụ Tư vấn Pháp lý Quý 4/2025 (Đã cập nhật)",
  "status": "PENDING_APPROVAL",
  "expiryDate": "2026-01-15",
  "partiesJson": "{\"ben_cung_cap\":\"Công ty Luật ABC\",\"ben_su_dung\":\"Tập đoàn XYZ\", \"phu_luc\": \"PL01\"}",
  "creatorId": 101,
  "version": 0
}
```

### Response Body

**Response khi thành công (Code `200 OK`):**

Trả về đối tượng `Contract` đã được cập nhật, với `version` đã tăng lên 1.

```json
{
    "id": 1,
    "title": "Hợp đồng Dịch vụ Tư vấn Pháp lý Quý 4/2025 (Đã cập nhật)",
    "status": "PENDING_APPROVAL",
    "createdAt": "2025-08-16T10:00:00Z",
    "expiryDate": "2026-01-15",
    "partiesJson": "{\"ben_cung_cap\":\"Công ty Luật ABC\",\"ben_su_dung\":\"Tập đoàn XYZ\", \"phu_luc\": \"PL01\"}",
    "systemId": "system1",
    "creatorId": 101,
    "version": 1
}
```

### Test Instructions / Notes

1.  **Kiểm tra cập nhật thành công:**
    -   Lấy một hợp đồng có `id=1` và `version=0`.
    -   Gửi request `PUT` với `version=0` và các thông tin thay đổi.
    -   Kiểm tra response trả về có `version=1` và các thông tin đã được cập nhật.

2.  **Kiểm tra Optimistic Locking (Lỗi `409 Conflict`):**
    -   **Bước 1:** Lấy hợp đồng có `id=1`, giả sử `version` là `1`.
    -   **Bước 2:** Gửi một request `PUT` với `version=1` để cập nhật thành công. `version` trong DB giờ là `2`.
    -   **Bước 3:** Gửi lại một request `PUT` khác với `version` cũ là `1`.
    -   **Kết quả mong muốn:** Nhận được lỗi `409 Conflict`, cho biết bản ghi đã bị thay đổi bởi một giao dịch khác.

3.  **Kiểm tra validation:**
    -   Thực hiện tương tự như API tạo mới (để trống `title`, `expiryDate` trong quá khứ, ...).

---

## 3. Các Endpoint khác

-   **`GET /contracts/{id}`**: Lấy chi tiết hợp đồng. Test case cần kiểm tra là lấy hợp đồng với ID tồn tại và ID không tồn tại (mong muốn lỗi 404).
-   **`DELETE /contracts/{id}`**: Xóa hợp đồng. Test case cần kiểm tra là xóa hợp đồng tồn tại và không tồn tại.
-   **`GET /contracts/status/{status}`**: Lấy danh sách hợp đồng theo trạng thái (`DRAFT`, `ACTIVE`, ...). Test case cần kiểm tra với các trạng thái hợp lệ và không hợp lệ.
-   **`POST /contracts/{id}/attachments`**: Thêm file đính kèm. Test case cần kiểm tra việc thêm attachment vào contract ID tồn tại và không tồn tại.
