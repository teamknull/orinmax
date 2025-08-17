# Sunx - Secure Authentication System

A modern, secure authentication system built with Next.js, Better Auth, and Prisma.

## Features

- 🔐 **Email & Password Authentication** - Secure sign up and sign in
- 🎨 **Modern UI** - Beautiful, responsive design with dark theme
- 🔒 **Password Reset** - Complete forgot password flow
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast & Secure** - Built with Next.js 15 and Better Auth
- 🗄️ **Database Ready** - SQLite with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Better Auth
- **Database**: SQLite with Prisma
- **UI**: Tailwind CSS + Radix UI
- **Styling**: Custom components with glassmorphism effects
- **Validation**: Zod schemas
- **Notifications**: Sonner toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sunx
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Generate Prisma client and push database schema:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Flow

### Sign Up
1. Navigate to `/auth`
2. Click "Sign Up" tab
3. Fill in your information (name, email, password)
4. Optionally upload a profile image
5. Click "Create an account"

### Sign In
1. Navigate to `/auth`
2. Enter your email and password
3. Click "Sign In"

### Password Reset
1. On the sign-in page, click "Forgot your password?"
2. Enter your email address
3. Check your email for the reset link
4. Click the link and set a new password

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login.tsx          # Main login/signup page
│   ├── dashboard/
│   │   └── page.tsx           # Protected dashboard
│   ├── forgot-password/
│   │   └── page.tsx           # Password reset request
│   ├── reset-password/
│   │   └── page.tsx           # Password reset form
│   └── api/auth/[...all]/
│       └── route.ts           # Better Auth API routes
├── components/
│   ├── sign-in.tsx            # Sign in form component
│   ├── sign-up.tsx            # Sign up form component
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── auth.ts                # Better Auth configuration
│   ├── auth-client.ts         # Client-side auth utilities
│   ├── prisma.ts              # Prisma client
│   └── types.ts               # Zod schemas
└── generated/
    └── prisma/                # Generated Prisma client
```

## Configuration

### Better Auth Configuration

The authentication is configured in `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Password reset configuration
    async sendResetPassword({ user, url, token }, request) {
      // Implement your email sending logic here
    },
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
```

### Database Schema

The database schema is defined in `prisma/schema.prisma` and includes:

- **User**: User information and authentication data
- **Session**: User sessions for authentication
- **Account**: OAuth and credential accounts
- **Verification**: Email verification tokens

## Security Features

- **Password Hashing**: Uses scrypt for secure password hashing
- **Session Management**: Secure session handling with expiration
- **Input Validation**: Zod schemas for all form inputs
- **CSRF Protection**: Built-in CSRF protection with Better Auth
- **Rate Limiting**: Configurable rate limiting for auth endpoints

## Customization

### Styling
The UI uses a custom dark theme with glassmorphism effects. You can customize the styling by modifying:

- `src/app/globals.css` - Global styles
- Component-specific CSS classes in the components
- Tailwind configuration in `tailwind.config.js`

### Email Configuration
To enable email functionality (password reset, verification), implement the email sending functions in `src/lib/auth.ts`:

```typescript
async sendResetPassword({ user, url, token }, request) {
  // Send email using your preferred email service
  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<a href="${url}">Reset Password</a>`,
  });
}
```

## Deployment

### Environment Variables

Make sure to set these environment variables in production:

```env
DATABASE_URL="file:./local.db"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Database

For production, consider using a more robust database like PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update the auth configuration:
```typescript
database: prismaAdapter(prisma, {
  provider: "postgresql",
}),
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
