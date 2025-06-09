# 🥷 Cyber Ninja Academy - Secure Container
FROM python:3.11-slim

# 🛡️ Security: Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# 📦 Install system dependencies with security updates
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 🔧 Set working directory
WORKDIR /app

# 📋 Copy requirements first for better caching
COPY requirements.txt .

# 🐍 Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 📁 Copy application files
COPY *.html ./
COPY *.css ./
COPY *.js ./
COPY *.py ./

# 🔒 Security: Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# 🛡️ Security: Switch to non-root user
USER appuser

# 🌐 Expose port
EXPOSE 8080

# 🔍 Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# 🚀 Start the application
ENV PORT=8080
ENV ENVIRONMENT=production
CMD gunicorn -b :$PORT game_server:app 