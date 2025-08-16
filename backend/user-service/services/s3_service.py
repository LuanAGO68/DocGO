from fastapi import UploadFile
from config.s3 import s3_client, BUCKET_NAME

async def upload_avatar_to_s3(user_id: int, file: UploadFile) -> str:
    file_key = f"system1/avatars/{user_id}/{file.filename}"
    s3_client.upload_fileobj(file.file, BUCKET_NAME, file_key)
    # Tạo signed URL (hết hạn sau 1 tuần)
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': BUCKET_NAME, 'Key': file_key},
        ExpiresIn=604800
    )
    return url