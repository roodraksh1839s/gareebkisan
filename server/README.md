# Gareeb Kisan - Backend API

Backend server for the Gareeb Kisan agricultural platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Profile management, settings, password change
- **Crop Management**: Farm logs, crop tracking, expense management
- **Marketplace**: Product listings, buy/sell functionality
- **Community**: Posts, comments, likes, discussions
- **Government Schemes**: Browse and search agricultural schemes
- **Weather Alerts**: Location-based weather alerts

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- Set `MONGODB_URI` to your MongoDB connection string
- Generate secure secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Configure other environment variables as needed

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get user settings
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete account

### Crops
- `GET /api/crops` - Get all crop logs
- `POST /api/crops` - Create crop log
- `GET /api/crops/:id` - Get crop log by ID
- `PUT /api/crops/:id` - Update crop log
- `DELETE /api/crops/:id` - Delete crop log
- `POST /api/crops/:id/activities` - Add activity to crop log
- `GET /api/crops/statistics` - Get farm statistics

### Marketplace
- `GET /api/marketplace` - Get all listings
- `POST /api/marketplace` - Create listing
- `GET /api/marketplace/my-listings` - Get user's listings
- `GET /api/marketplace/:id` - Get listing by ID
- `PUT /api/marketplace/:id` - Update listing
- `DELETE /api/marketplace/:id` - Delete listing
- `POST /api/marketplace/:id/inquire` - Mark inquiry

### Community
- `GET /api/community` - Get all posts
- `POST /api/community` - Create post
- `GET /api/community/my-posts` - Get user's posts
- `GET /api/community/:id` - Get post by ID
- `PUT /api/community/:id` - Update post
- `DELETE /api/community/:id` - Delete post
- `POST /api/community/:id/like` - Like/unlike post
- `POST /api/community/:id/comments` - Add comment

### Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get scheme by ID
- `POST /api/schemes` - Create scheme (admin only)

### Weather Alerts
- `GET /api/weather-alerts` - Get all alerts
- `GET /api/weather-alerts/my-alerts` - Get user's location-based alerts
- `GET /api/weather-alerts/:id` - Get alert by ID
- `POST /api/weather-alerts` - Create alert (admin only)

## Database Models

- **User**: User accounts with authentication
- **CropLog**: Farm and crop management records
- **MarketplaceListing**: Product listings
- **CommunityPost**: Community posts and discussions
- **Scheme**: Government schemes information
- **WeatherAlert**: Weather alerts and warnings

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Error Handling

The API uses consistent error responses:
```json
{
  "error": "Error message"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Development

### Project Structure
```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── index.ts        # App entry point
├── .env.example        # Environment variables template
├── package.json
└── tsconfig.json
```

## License

MIT
