# Pet Adoption Platform

A full-stack web application for pet adoption that aggregates data from a PostgreSQL database. The platform enables users to browse, search, and filter available pets for adoption.

## Features

- User authentication (login/register)
- Pet listings with detailed profiles
- Advanced search and filtering capabilities
- Admin dashboard for managing pets
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pet-adoption-platform.git
   cd pet-adoption-platform
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/pet_adoption
   SESSION_SECRET=your_session_secret
   ```

4. Push the database schema
   ```bash
   npm run db:push
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5000

## Project Structure

- `client/`: React frontend code
  - `src/components/`: UI components
  - `src/hooks/`: Custom React hooks
  - `src/pages/`: Application pages
- `server/`: Express backend code
  - `routes.ts`: API endpoints
  - `auth.ts`: Authentication logic
  - `storage.ts`: Database interactions
- `shared/`: Shared code between frontend and backend
  - `schema.ts`: Database schema and types

## License

MIT