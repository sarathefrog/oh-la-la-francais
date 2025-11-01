# Docker Setup for Oh La La Français

This guide will help you set up and run the Oh La La Français application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd oh-la-la-francais
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your actual configuration values.

3. **Build and start the services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Web Dashboard: http://localhost:3000
   - API: http://localhost:3001
   - Nginx (if enabled): http://localhost:80

## Services Overview

### Main Application (`app`)
- **Port**: 3000 (web), 3001 (API)
- **Description**: Main web application and API server
- **Health Check**: `/api/health`

### Telegram Bot (`telegram-bot`)
- **Description**: Telegram bot service for student interactions
- **Dependencies**: Database, Google Calendar credentials

### Database (`db`)
- **Type**: SQLite
- **Volume**: `db_data` (persistent storage)
- **Description**: Lightweight database service

### Nginx (`nginx`)
- **Port**: 80, 443
- **Description**: Reverse proxy and load balancer
- **Features**: Rate limiting, compression, security headers

## Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Application
NODE_ENV=production
PORT=3000
API_PORT=3001

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username

# Google Calendar
GOOGLE_CALENDAR_CREDENTIALS_PATH=./google-credentials.json
```

## Docker Commands

### Build and Start
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
```

### Database Operations
```bash
# Run Prisma migrations
docker-compose exec app npx prisma db push

# Generate Prisma client
docker-compose exec app npx prisma generate

# Access database shell
docker-compose exec app npx prisma studio
```

### Service Management
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart specific service
docker-compose restart app

# Scale services
docker-compose up --scale app=3
```

### Development
```bash
# Run in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Execute commands in running container
docker-compose exec app npm install
docker-compose exec app npx prisma db push
```

## Production Deployment

### Using Docker Compose
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Using Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml oh-la-la-francais
```

## Monitoring and Logs

### Health Checks
- Application: `http://localhost:3000/api/health`
- Nginx: `http://localhost/health`

### Log Management
```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app telegram-bot
```

### Resource Monitoring
```bash
# View resource usage
docker stats

# View container details
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   
   # Change ports in docker-compose.yml
   ```

2. **Database connection issues**:
   ```bash
   # Check database container
   docker-compose exec db ls -la /data
   
   # Reset database
   docker-compose down -v
   docker-compose up --build
   ```

3. **Permission issues**:
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Debugging

```bash
# Access container shell
docker-compose exec app sh

# Check environment variables
docker-compose exec app env

# View container logs
docker logs <container-name>
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Secrets Management**: Use Docker secrets for production
3. **Network Security**: Use custom networks
4. **Resource Limits**: Set memory and CPU limits
5. **Regular Updates**: Keep base images updated

## Backup and Recovery

### Database Backup
```bash
# Backup database
docker-compose exec db sqlite3 /data/dev.db ".backup /data/backup.db"

# Restore database
docker-compose exec db sqlite3 /data/dev.db < backup.sql
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v oh-la-la-francais_db_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz -C /data .
```

## Performance Optimization

1. **Multi-stage builds**: Already implemented in Dockerfile
2. **Layer caching**: Optimized COPY commands
3. **Resource limits**: Set in docker-compose.yml
4. **Health checks**: Implemented for all services
5. **Logging**: Structured logging with log rotation

## Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Check service health endpoints
4. Review Docker and Docker Compose documentation







