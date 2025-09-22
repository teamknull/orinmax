# OrionPack v2.1 - U.S. Government Environmental DNA Analysis System

A classified government research platform for analyzing environmental DNA sequences using advanced clustering algorithms and molecular visualization tools.
<div align="center">
  <img src="https://github.com/user-attachments/assets/1cde1a61-5b6d-4ef7-a912-a90f81b9dda2" alt="Sign In Page" width="300" height="200" style="border-radius: 8px; margin: 8px;" />
  <img src="https://github.com/user-attachments/assets/a5d9f67a-da94-483d-bae0-a585c67c9feb" alt="Sign Up Page" width="300" height="200" style="border-radius: 8px; margin: 8px;" />
  <img src="https://github.com/user-attachments/assets/731c5049-93e8-45ea-b256-bbd57319d41c" alt="Dashboard" width="300" height="200" style="border-radius: 8px; margin: 8px;" />
</div>
## 🔒 CLASSIFIED FEATURES

- 🔐 **SECURE AUTHENTICATION** - Multi-level clearance system with encrypted sessions
- 🧬 **DNA SEQUENCE ANALYSIS** - Advanced clustering algorithms for environmental samples
- 🎯 **MOLECULAR VISUALIZATION** - 3D DNA helix rendering with nucleotide mapping
- ⚡ **REAL-TIME PROCESSING** - High-performance sequence analysis engine
- 🗄️ **SECURE DATABASE** - Encrypted data storage with audit trails
- 📊 **ANALYSIS REPORTING** - Detailed clustering results with statistical metrics
- 🔬 **RESEARCH TOOLS** - Professional molecular biology analysis suite
- 📈 **DATA EXPORT** - JSON output with government-standard formatting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- bun, yarn, or pnpm

### 1. Clone and Install

```bash
git clone https://github.com/rajofearth/orionpack.git
cd orionpack
bun install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
# Database (SQLite by default)
DATABASE_URL="file:./local.db"

# App URL (no trailing slash)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
bun run prisma:generate

# Push schema to database
bun run db:push
```

### 4. Start Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔬 SYSTEM ARCHITECTURE

```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx              # Security clearance authentication
│   │   └── action.ts             # Encrypted session management
│   ├── dashboard/
│   │   └── page.tsx              # Main research terminal interface
│   ├── api/auth/[...all]/
│   │   └── route.ts              # Secure authentication endpoints
│   ├── globals.css               # Government terminal styling
│   └── layout.tsx                # Classified system layout
├── components/
│   ├── auth-client.tsx           # Security clearance terminal
│   ├── cluster-client.tsx        # DNA analysis terminal
│   ├── dna-helix.tsx             # Molecular visualization module
│   ├── sign-in.tsx               # Clearance verification form
│   ├── sign-up.tsx               # Personnel registration form
│   └── ui/                       # Terminal interface components
├── lib/
│   ├── auth.ts                   # Security protocol configuration
│   ├── auth-client.ts            # Terminal authentication utilities
│   ├── action-helpers.ts         # Secure action processing
│   ├── types.ts                  # Classified data schemas
│   ├── prisma.ts                 # Encrypted database client
│   └── utils.ts                  # Analysis utilities
└── generated/
    └── prisma/                   # Auto-generated database client
```

## 🔧 Configuration

### Better Auth Setup

The authentication is configured in `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    async sendResetPassword({ user, url, token }, request) {
      // TODO: Implement your email sending logic here
      console.log(`Password reset email for ${user.email}: ${url}`);
    },
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  plugins: [nextCookies()],
});
```

### Database Schema

The Prisma schema includes all necessary tables for Better Auth:

- **User** - User information and authentication data
- **Session** - User sessions for authentication
- **Account** - OAuth and credential accounts
- **Verification** - Email verification tokens

## 🎨 Customization

### Styling

The template uses Tailwind CSS v4 with a custom dark theme. Customize by modifying:

- `src/app/globals.css` - Global styles and CSS variables
- Component-specific classes in the components
- The theme uses CSS variables for easy customization

### Email Provider

To enable email functionality (password reset, verification), implement the email sending functions in `src/lib/auth.ts`:

```typescript
async sendResetPassword({ user, url, token }, request) {
  // Example with Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@yourdomain.com',
      to: user.email,
      subject: 'Reset your password',
      html: `<a href="${url}">Reset Password</a>`,
    }),
  });
}
```

Popular email providers:
- [Resend](https://resend.com) - Developer-friendly email API
- [SendGrid](https://sendgrid.com) - Enterprise email service
- [Postmark](https://postmarkapp.com) - Transactional email
- [AWS SES](https://aws.amazon.com/ses/) - Amazon's email service

## 🚀 Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Database Migration

For production, consider using PostgreSQL:

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

3. Deploy your database and run migrations:
```bash
npx prisma migrate deploy
```

### Deployment Platforms

This template works with all major deployment platforms:

- **Vercel** - Recommended for Next.js apps
- **Netlify** - Great for static sites
- **Railway** - Easy database + app deployment
- **Render** - Simple deployment with PostgreSQL
- **AWS/GCP/Azure** - Enterprise deployments

## 🛠️ Development

### Available Scripts

```bash
bun dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run typecheck    # TypeScript type checking
bun run prisma:generate  # Generate Prisma client
bun run db:push      # Push schema to database
```

### Adding New Features

1. **New Pages**: Add to `src/app/` following the existing pattern
2. **Components**: Create in `src/components/` with proper TypeScript
3. **Server Actions**: Use the `validatedAction` helper in `src/lib/action-helpers.ts`
4. **Database**: Add models to `prisma/schema.prisma`

## 🔒 Security Features

- **Password Hashing** - Uses scrypt for secure password hashing
- **Session Management** - Secure session handling with expiration
- **Input Validation** - Zod schemas for all form inputs
- **CSRF Protection** - Built-in CSRF protection with Better Auth
- **Rate Limiting** - Configurable rate limiting for auth endpoints
- **Type Safety** - Full TypeScript coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Better Auth](https://better-auth.com) - Authentication library
- [Prisma](https://prisma.io) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Tailwind CSS](https://tailwindcss.com) - CSS framework

---

**CLASSIFIED ACCESS GRANTED** 🔐

This government research platform provides secure environmental DNA analysis capabilities for authorized personnel. Handle with appropriate security clearance.

**SECURITY NOTICE:** This system contains sensitive research data. Unauthorized access is prohibited and will be prosecuted under federal law.
