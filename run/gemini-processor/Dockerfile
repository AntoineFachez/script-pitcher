# Use the official lightweight Python image.
# [https://hub.docker.com/_/python](https://hub.docker.com/_/python)
FROM python:3.11-slim

# Allow statements and log messages to be sent straight to the logs
ENV PYTHONUNBUFFERED True

# Set the working directory in the container
WORKDIR /app

# Copy over the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set the command to run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]


# gcloud run deploy gemini-processor-service \
#  --source ./run/gemini-processor \
#  --platform managed \
#  --region europe-west4 \
#  --service-account "gemini-processor-sa@script-pitcher.iam.gserviceaccount.com" \
#  --allow-unauthenticated
  