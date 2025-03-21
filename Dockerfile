# === Stage 1: Fetch FiveM Artifacts ===
FROM alpine AS artifacts
RUN apk add --no-cache curl tar jq dtrx

WORKDIR /opt/fivem

# Download and extract FiveM artifacts
RUN curl -s https://artifacts.jgscripts.com/json | jq -r .linuxDownloadLink | \
    xargs -I {} curl -s "{}" -o fx.tar.xz && \
    dtrx fx.tar.xz && \
    rm -rf fx/alpine/{dev,proc,run,sys} fx.tar.xz

# === Stage 3: Final Server Image ===
FROM alpine AS server
LABEL maintainer="ThePawlow <business.shine939@passinbox.com>"

# Install only necessary dependencies
RUN apk add --no-cache clang 

WORKDIR /opt/fivem

# Copy FiveM server binaries
COPY --from=artifacts /opt/fivem/fx/alpine server

WORKDIR /opt/fivem/server-data

# Copy server configuration and entrypoint script
COPY server.cfg /opt/fivem/server-data
COPY entrypoint.sh /opt/fivem/server-data

# Create a non-root user for security
RUN adduser -D -h /opt/fivem -s /sbin/nologin fivemuser && \
    chown -R fivemuser:fivemuser /opt/fivem

RUN chmod +x /opt/fivem/server-data/entrypoint.sh

USER fivemuser

EXPOSE 30120/tcp 30120/udp

ENTRYPOINT ["./entrypoint.sh"]
