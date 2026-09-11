FROM node:22-alpine

WORKDIR /workspace

ENV NEXT_TELEMETRY_DISABLED=1

# Install each UI independently. The named BuildKit context keeps the local
# operations package at the same relative path used by backoffice/package.json.
COPY website/package.json website/package-lock.json ./uis/website/
RUN cd uis/website \
    && npm ci \
    && sha256sum package-lock.json | cut -d " " -f 1 > node_modules/.package-lock.sha256

COPY --from=operations package.json ./apps/operations/package.json
COPY --from=operations src ./apps/operations/src
COPY backoffice/package.json backoffice/package-lock.json ./uis/backoffice/
RUN cd uis/backoffice \
    && npm ci \
    && sha256sum package-lock.json | cut -d " " -f 1 > node_modules/.package-lock.sha256

COPY . ./uis

EXPOSE 3000 3001

CMD ["sh", "-c", "cp /workspace/uis/start.sh /tmp/start.sh && dos2unix /tmp/start.sh && exec sh /tmp/start.sh"]
