FROM mcr.microsoft.com/vscode/devcontainers/base:0-jammy

ENV DEBIAN_FRONTEND=noninteractive
SHELL ["/bin/bash", "-lc"]

# Install build tools
RUN apt-get update \
  && apt-get install -y curl git build-essential ca-certificates gnupg2 --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN mkdir -p -m 755 /etc/apt/keyrings \
  && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
  && apt-get update \
  && apt-get install -y gh --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Install Docker CLI (Docker outside of Docker)
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \
  && chmod a+r /etc/apt/keyrings/docker.asc \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list \
  && apt-get update \
  && apt-get install -y docker-ce-cli docker-compose-plugin --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -f docker \
  && usermod -aG docker vscode

# Install mise for the vscode user
USER vscode
RUN curl -fsSL https://mise.run | sh \
  && echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc

WORKDIR /workspace