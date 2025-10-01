# Idea Board - Full Stack Application

A modern, real-time anonymous idea board built with Next.js, Express.js, and PostgreSQL. Users can submit ideas (max 280 characters), upvote others' ideas, and see live updates.

## 🚀 Features

- ✅ Beautiful, responsive landing page with hero and features sections
- ✅ Anonymous idea submission (no authentication required)
- ✅ Real-time updates via polling (5-second intervals)
- ✅ Upvote functionality with persistent counts
- ✅ PostgreSQL database with proper schema
- ✅ CORS configured for production deployment
- ✅ Docker containerization for easy deployment
- ✅ One-command setup with docker-compose

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose installed on your system
- For AWS Lightsail: Ubuntu instance with at least 2GB RAM

## 📂 Complete File Checklist

Make sure you have all these files in your project:

```
idea-board/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── .env.example (optional)
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── app/
│   │       └── page.js
│   └── components/
│       ├── IdeaBoard.js
│       └── LandingPage.js
└── backend/
    ├── .env.example
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── db.js
        ├── index.js
        └── routes/
            └── ideas.js
```

## 🏃 Quick Start

### Local Development

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd idea-board
```

2. **Create environment file**

```bash
cp .env.example .env
```

3. **Start the application**

```bash
docker-compose up --build
```

4. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

That's it! The application will automatically:

- Create the PostgreSQL database
- Initialize the schema
- Start all services
- Set up networking between containers

## 🌐 AWS Lightsail Deployment

### Step 1: Prepare Your Lightsail Instance

1. **Create a Lightsail instance**
   - Choose Ubuntu 22.04 LTS
   - Select at least 2GB RAM plan
   - Configure networking to allow HTTP/HTTPS traffic

2. **SSH into your instance**

```bash
ssh ubuntu@<your-lightsail-ip>
```

3. **Install Docker**

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
```

4. **Install Docker Compose**

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

5. **Logout and login again**

```bash
exit
ssh ubuntu@<your-lightsail-ip>
```

### Step 2: Deploy the Application

1. **Clone your repository**

```bash
git clone <your-repo-url>
cd idea-board
```

2. **Configure environment for production**

```bash
cp .env.example .env
nano .env
```

Update the `.env` file with your Lightsail IP:

```env
# Database
POSTGRES_USER=ideaboard
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=ideaboard

# Backend
NODE_ENV=production
PORT=5000

# Frontend - UPDATE THESE WITH YOUR IP
NEXT_PUBLIC_API_URL=http://YOUR_LIGHTSAIL_IP:5000
FRONTEND_URL=http://YOUR_LIGHTSAIL_IP:3000
```

3. **Start the application**

```bash
docker-compose up -d --build
```

4. **Verify deployment**

```bash
docker-compose ps
docker-compose logs -f
```

### Step 3: Configure Networking

In your Lightsail console:

1. Go to your instance's "Networking" tab
2. Add firewall rules:
   - Custom TCP on port 3000 (Frontend)
   - Custom TCP on port 5000 (Backend)

### Step 4: Access Your Application

Open your browser and navigate to:

```
http://YOUR_LIGHTSAIL_IP:3000
```

## 📡 API Endpoints

### GET /health

Health check endpoint

```json
{
  "status": "ok",
  "timestamp": "2025-10-08T10:30:00.000Z"
}
```

### GET /api/ideas

Get all ideas with upvote counts

**Response:**

```json
[
  {
    "id": 1,
    "text": "Build a better mousetrap",
    "upvotes": 5,
    "created_at": "2025-10-08T10:30:00.000Z"
  }
]
```

### POST /api/ideas

Create a new idea

**Request Body:**

```json
{
  "text": "Your idea here (max 280 characters)"
}
```

**Response:**

```json
{
  "id": 1,
  "text": "Your idea here",
  "upvotes": 0,
  "created_at": "2025-10-08T10:30:00.000Z"
}
```

### POST /api/ideas/:id/upvote

Upvote an idea

**Response:**

```json
{
  "id": 1,
  "text": "Your idea here",
  "upvotes": 1,
  "created_at": "2025-10-08T10:30:00.000Z"
}
```

## 🏗 Project Structure

```
idea-board/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router
│   │   ├── layout.js       # Root layout
│   │   ├── page.js         # Landing page (/)
│   │   ├── globals.css     # Global styles
│   │   └── app/
│   │       └── page.js     # Idea board page (/app)
│   ├── components/
│   │   ├── LandingPage.js  # Landing page component
│   │   └── IdeaBoard.js    # Main idea board component
│   ├── Dockerfile          # Frontend container config
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── index.js        # Main server file
│   │   ├── db.js           # Database connection & init
│   │   └── routes/
│   │       └── ideas.js    # API routes for ideas
│   ├── Dockerfile          # Backend container config
│   └── package.json
├── docker-compose.yml       # Multi-container orchestration
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🗄 Database Schema

```sql
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  text VARCHAR(280) NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Docker Configuration

### Services

1. **db** (PostgreSQL)
   - Port: 5432
   - Volume: `postgres_data` for data persistence
   - Health check enabled

2. **backend** (Express.js)
   - Port: 5000
   - Depends on: db
   - Auto-restarts on failure

3. **frontend** (Next.js)
   - Port: 3000
   - Depends on: backend
   - Standalone output for optimal performance

### Volumes

- `postgres_data`: Persists PostgreSQL data across container restarts

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Verify database is healthy
docker-compose ps
```

### Frontend Can't Connect to Backend

1. Verify `NEXT_PUBLIC_API_URL` in `.env`
2. Check CORS settings in `backend/src/index.js`
3. Ensure ports are open in firewall/security groups
4. Check backend logs: `docker-compose logs backend`

### Port Already in Use

```bash
# Stop all containers
docker-compose down

# Change ports in docker-compose.yml or .env
# Then restart
docker-compose up -d
```

### Clear Everything and Restart

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build
```

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## 🔐 Security Notes

- Change the default PostgreSQL password in production
- Use environment-specific `.env` files
- Consider adding rate limiting for the API
- For production, use a reverse proxy (Nginx) with SSL
- Keep Docker images updated

## 🚀 Performance Optimization

- Database indexes on `created_at` for sorting
- Frontend uses polling (5s) for real-time updates
- Next.js standalone output for smaller image size
- PostgreSQL connection pooling enabled

## 📝 Development

### Run Locally Without Docker

**Backend:**

```bash
cd backend
npm install
cp .env.example .env
# Update DATABASE_URL in .env
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

See `.env.example` for all required environment variables.

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the Full Stack Developer Assessment
