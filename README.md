# 📝 Posts Dashboard

A modern, responsive dashboard application built with Next.js 15 for managing blog posts. Features a clean public interface for reading posts and a comprehensive admin dashboard for CRUD operations.

![Posts Dashboard](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

## ✨ Features

### 🌐 Public Site
- **Responsive post listing** with card-based layout
- **Individual post pages** with clean typography
- **Dark/Light theme** toggle with system preference detection
- **Mobile-optimized** navigation and interactions
- **Loading states** and error handling

### 🔧 Admin Dashboard
- **Full CRUD operations** for posts (Create, Read, Update, Delete)
- **Rich text editing** with simple textarea editor
- **Responsive admin interface** with mobile navigation
- **Confirmation dialogs** for destructive actions
- **Form validation** and loading states
- **Bulk operations** support

### 🎨 Design System
- **Mobile-first responsive design** (320px to 1920px+)
- **shadcn/ui components** for consistent UI
- **Custom responsive utilities** for rapid development
- **Accessible components** with proper ARIA labels
- **Smooth animations** and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/posts-dashboard.git
cd posts-dashboard
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Start the development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Public Site
- **Homepage**: Browse all posts in a responsive grid layout
- **Post Details**: Click "Read More" to view full post content
- **Theme Toggle**: Switch between light/dark themes
- **Navigation**: Access admin dashboard via the "Admin" button

### Admin Dashboard
- **Posts Management**: View all posts at `/admin`
- **Create Post**: Add new posts at `/admin/posts/new`
- **Edit Post**: Modify existing posts at `/admin/posts/[id]/edit`
- **Delete Post**: Remove posts with confirmation dialog

## 🏗️ Project Structure

\`\`\`
posts-dashboard/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard routes
│   │   ├── posts/[id]/edit/     # Edit post pages
│   │   ├── posts/new/           # New post creation
│   │   ├── layout.tsx           # Admin layout with navigation
│   │   └── page.tsx             # Admin posts list
│   ├── posts/[id]/              # Public post detail pages
│   ├── globals.css              # Global styles & utilities
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── post-skeleton.tsx        # Loading skeletons
│   ├── simple-text-editor.tsx   # Text editor
│   └── theme-toggle.tsx         # Theme switcher
├── lib/                         # Core utilities
│   ├── hooks/                   # Custom React hooks
│   ├── api.ts                   # API functions
│   └── react-query.tsx          # React Query setup
└── README.md                    # This file
\`\`\`

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience
- **[React 18](https://reactjs.org/)** - UI library with concurrent features

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### State Management
- **[TanStack Query](https://tanstack.com/query)** - Data fetching & caching
- **React Hooks** - Local state management

### API Integration
- **[JSONPlaceholder](https://jsonplaceholder.typicode.com/)** - Fake REST API for testing

## 📐 Responsive Breakpoints

The application uses a mobile-first approach with these breakpoints:

| Breakpoint | Width | Description |
|------------|-------|-------------|
| `xs` | `< 640px` | Mobile phones |
| `sm` | `≥ 640px` | Large phones, small tablets |
| `lg` | `≥ 1024px` | Tablets, small laptops |
| `xl` | `≥ 1280px` | Laptops, desktops |

### Grid Layouts
- **Mobile**: 1 column
- **Tablet**: 2 columns  
- **Desktop**: 3-4 columns
- **Large Desktop**: 4+ columns

## 🎨 Customization

### Theme Configuration
Modify theme colors in `app/globals.css`:

\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... other CSS variables */
}
\`\`\`

### Responsive Utilities
Use custom responsive classes:

\`\`\`typescript
<div className="container-responsive">     {/* Responsive container */}
<div className="grid-responsive">         {/* Responsive grid */}
<Button className="button-responsive">    {/* Responsive button */}
<div className="mobile-full">            {/* Full width on mobile */}
\`\`\`

### Adding New Components
Follow the established patterns:

\`\`\`typescript
// components/my-component.tsx
"use client"

interface MyComponentProps {
  title: string
  children: React.ReactNode
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
\`\`\`

## 🔧 API Integration

### Adding New Endpoints

1. **Define types** in `lib/api.ts`:
\`\`\`typescript
export interface NewResource {
  id: number
  name: string
}
\`\`\`

2. **Add API functions**:
\`\`\`typescript
export const newResourceApi = {
  getResources: async (): Promise<NewResource[]> => {
    const response = await fetch(\`\${API_BASE}/resources\`)
    if (!response.ok) throw new Error("Failed to fetch")
    return response.json()
  }
}
\`\`\`

3. **Create hooks** in `lib/hooks/`:
\`\`\`typescript
export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: newResourceApi.getResources,
  })
}
\`\`\`

## 🧪 Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
\`\`\`

### Code Quality
- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** for code formatting (recommended)

### Development Guidelines
- Use **TypeScript** for all new files
- Follow **mobile-first** responsive design
- Implement **loading states** for all async operations
- Add **error handling** for all API calls
- Use **semantic HTML** for accessibility

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

### Build Configuration
\`\`\`bash
npm run build    # Creates optimized production build
npm run start    # Serves the production build
\`\`\`

## 🔒 Environment Variables

Create a `.env.local` file for local development:

\`\`\`bash
# API Configuration
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
\`\`\`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: \`git checkout -b feature/amazing-feature\`
3. **Commit your changes**: \`git commit -m 'Add amazing feature'\`
4. **Push to the branch**: \`git push origin feature/amazing-feature\`
5. **Open a Pull Request**

### Commit Convention
\`\`\`
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
\`\`\`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** for the amazing framework
- **[shadcn](https://twitter.com/shadcn)** for the beautiful UI components
- **[Tailwind CSS](https://tailwindcss.com/)** for the utility-first CSS framework
- **[TanStack](https://tanstack.com/)** for the powerful data fetching library
- **[JSONPlaceholder](https://jsonplaceholder.typicode.com/)** for the free testing API

## 📞 Support

If you have any questions or need help:

- 📧 **Email**: your-email@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/posts-dashboard/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/posts-dashboard/discussions)

---

**Made with ❤️ using Next.js 15 and modern web technologies**

⭐ **Star this repository if you found it helpful!**
