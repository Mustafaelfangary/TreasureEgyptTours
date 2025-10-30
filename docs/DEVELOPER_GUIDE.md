# Developer Guide - Content Management System

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 13+ (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI**: React, TailwindCSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Rich Text**: TipTap
- **Testing**: Jest, React Testing Library, Cypress

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel routes
│   ├── api/               # API routes
│   └── (public)/          # Public routes
├── components/
│   ├── admin/             # Admin components
│   ├── forms/             # Form components
│   ├── ui/                # UI components
│   └── ...
├── lib/
│   ├── auth.ts            # Auth configuration
│   ├── content-models.ts  # Content model definitions
│   ├── content-service.ts # Content CRUD operations
│   └── ...
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation
```bash
# Clone repository
git clone [repo-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run migrations
npx prisma migrate dev

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Content Models

### Defining a Content Model

Create models in `src/lib/content-models.ts`:

```typescript
export const myContentModel: ContentModel = {
  id: 'my-model',
  name: 'My Content Model',
  description: 'Description of the model',
  icon: 'FileText',
  fields: [
    {
      id: 'title',
      type: 'string',
      label: 'Title',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
      },
    },
    // Add more fields...
  ],
  searchFields: ['title'],
};
```

### Field Types
- `string`: Single-line text
- `textarea`: Multi-line text
- `richtext`: WYSIWYG editor
- `number`: Numeric input
- `boolean`: Toggle switch
- `select`: Dropdown
- `image`: Image upload
- `file`: File upload
- `date`: Date picker
- `email`: Email input
- `url`: URL input

## API Development

### Creating API Routes

```typescript
// src/app/api/admin/my-endpoint/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // Your logic here
  return NextResponse.json({ data: 'response' });
}
```

### File Uploads
Use the file upload utility:

```typescript
import { handleFileUpload } from '@/lib/file-upload';

const files = await handleFileUpload(request, {
  allowedTypes: ['image/jpeg', 'image/png'],
  maxSize: 5 * 1024 * 1024, // 5MB
});
```

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run cypress:open
```

### Writing Tests
```typescript
import { render, screen } from '@/test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## Best Practices

1. **Use TypeScript** for type safety
2. **Validate all inputs** with Zod
3. **Handle errors** gracefully
4. **Write tests** for critical features
5. **Document** your code
6. **Follow** ESLint and Prettier rules

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## License
MIT
