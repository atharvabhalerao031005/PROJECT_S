# ==============================================================================
# Stage 1: Build the Vite Frontend SPA
# ==============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /build/frontend

# Copy frontend dependency manifests for optimal layer caching
COPY frontend/package*.json ./

# Install dependencies using clean install if package-lock is present
RUN if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi

# Copy frontend source files
COPY frontend/ ./

# Compile production assets to /build/frontend/dist
RUN npm run build


# ==============================================================================
# Stage 2: Python 3.11 Runtime for Computer Vision, Audio & Telemetry Backend
# ==============================================================================
FROM python:3.11-slim AS runtime

# Set production environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    HOST=0.0.0.0 \
    FRONTEND_DIST_DIR=/app/frontend/dist \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install native system libraries required by OpenCV, Librosa, Soundfile, and networking
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install backend Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application source
COPY backend/ ./backend/

# Copy compiled frontend distribution from Stage 1
COPY --from=frontend-builder /build/frontend/dist /app/frontend/dist

# Create a non-root system user and configure directory ownership
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user for security compliance
USER appuser

# Expose default HTTP / WebSocket telemetry port
EXPOSE 8000

# Container health check against FastAPI telemetry readiness route
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/health || exit 1

# Launch Uvicorn in production mode; dynamic ${PORT} resolution for Render/Railway/Fly.io
WORKDIR /app/backend
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
