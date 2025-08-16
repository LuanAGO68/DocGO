@echo off
REM =====================================
REM Tạo symlink cho các file SQL
REM trong backend\<service>\database
REM trỏ ra backend\<service>
REM =====================================

setlocal enabledelayedexpansion

REM Kiểm tra quyền Admin (mklink cần quyền Admin)
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Bạn phải chạy file này bằng quyền Administrator!
    pause
    exit /b 1
)

REM Lặp qua từng service trong backend
for /d %%S in (backend\*) do (
    if exist "%%S\database" (
        echo 📂 Đang xử lý service: %%~nS

        REM Lặp qua tất cả file .sql trong backend\<service>\database
        for %%F in (%%S\database\*.sql) do (
            set filename=%%~nxF
            set link=%%S\!filename!
            set target=database\!filename!

            REM Xóa symlink cũ nếu có
            if exist "!link!" (
                del "!link!"
            )

            echo 🔗 Tạo symlink "!link!" -> "!target!"
            mklink "!link!" "..\..\!target!"
        )
    )
)

echo ✅ Hoàn tất tạo symlinks!
pause
