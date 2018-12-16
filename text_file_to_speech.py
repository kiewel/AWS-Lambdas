import boto3
import os

def lambda_handler(event, context):
    
    file_name = event["Records"][-1]["s3"]["object"]["key"]                     # Get file name from event
    s3 = boto3.resource('s3')                                                   # Get the s3 resource
    object = s3.Object(os.environ['BUCKET_DOWNLOAD_NAME'],file_name)            # Get object from s3 bucket 
    object.download_file('/tmp/'+file_name)                                     # Download file associated with object
    text = open('/tmp/'+file_name,'r').read()                                   # Read file
    polly = boto3.client('polly')                                               # Get polly client
    polly.start_speech_synthesis_task(
            OutputS3BucketName=os.environ['BUCKET_UPLOAD_NAME'],
            OutputFormat='mp3',
            Text = text,
            VoiceId = os.environ['VOICE']
        )                                                                       # Start asynchronous speech syntesis task
        
    return
