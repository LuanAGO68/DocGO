import boto3
from botocore.client import Config

s3_client = boto3.client(
    's3',
    endpoint_url='http://localhost:9000',  # MinIO hoặc AWS S3 endpoint
    aws_access_key_id='minioadmin',
    aws_secret_access_key='miniopassword',
    config=Config(signature_version='s3v4')
)
BUCKET_NAME = 'system1-avatars'