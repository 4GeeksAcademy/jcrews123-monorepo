FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_SYSTEM_PYTHON=1

WORKDIR /workspace

COPY api/requirements.txt ./services/api/requirements.txt
RUN uv pip install --no-cache -r services/api/requirements.txt

COPY --from=incident-analysis pyproject.toml README.md ./packages/incident-analysis/
COPY --from=incident-analysis incident_analysis ./packages/incident-analysis/incident_analysis
RUN uv pip install --no-cache --editable packages/incident-analysis

COPY api ./services/api

WORKDIR /workspace/services/api

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
