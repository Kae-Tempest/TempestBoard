from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile

def checkfilesize(file: UploadedFile):
    if file.size > 3 * 1024 * 1024:
        raise ValidationError(
            "%(value)s is to big",
            params={"value": file.size},
        )