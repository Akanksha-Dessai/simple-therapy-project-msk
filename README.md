# SimpleTherapy Communications Toolkit Platform

## Overview
A comprehensive web-based communications toolkit platform that empowers organizations to access, customize, and distribute branded marketing assets with multilingual support, program-specific access control, and seamless integration with external platforms.

## Technology Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Express.js with TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation

---

## 🚀 **Developer Setup Guide**

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Local Development Setup

**1. Clone and Install Dependencies:**
```bash
git clone [repository-url]
cd simpletherapy-toolkit
npm install
```

**2. Database Setup:**
```bash
# Execute the comprehensive database setup script
psql -h localhost -U your_username -d your_database -f database-setup.sql

# Or connect to your PostgreSQL instance and run the script
```

**3. Environment Variables:**
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database_name
NODE_ENV=development
```

**4. Database Migration (Alternative to SQL script):**
If using Drizzle migrations instead of the SQL script:
```bash
npm run db:push
```

**5. Start Development Server:**
```bash
npm run dev
```

The application will start with:
- Frontend: http://localhost:5173
- Backend API: Same port (integrated)

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/           # Utilities and API client
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database interface (MemStorage/DatabaseStorage)
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Drizzle database schema & types
├── database-setup.sql    # Complete database setup script
└── package.json          # Dependencies and scripts
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate migration files
```

### Database Architecture Notes

**Current Storage Implementation:**
- Uses `MemStorage` class for in-memory data (default for development)
- Located in `server/storage.ts`
- Includes comprehensive seed data matching production requirements

**Switching to PostgreSQL:**
1. Update `server/storage.ts` to use `DatabaseStorage` instead of `MemStorage`
2. Ensure `DATABASE_URL` environment variable is set
3. Run the `database-setup.sql` script to create tables and seed data
4. The `DatabaseStorage` class interface is already defined and ready to implement

**Database Migration Strategy:**
- Option 1: Use the provided `database-setup.sql` script (recommended for initial setup)
- Option 2: Use Drizzle migrations with `npm run db:push`
- Both approaches create identical schema and seed data

### Key Implementation Files for Developers

**Frontend Core Files:**
- `client/src/App.tsx` - Main routing and app structure
- `client/src/pages/home.tsx` - Client access page
- `client/src/components/client-dashboard.tsx` - Main client interface
- `client/src/components/admin-panel.tsx` - Administrative interface
- `client/src/lib/api.ts` - API client configuration

**Backend Core Files:**
- `server/routes.ts` - All API endpoints and business logic
- `server/storage.ts` - Data access layer (switch MemStorage → DatabaseStorage)
- `shared/schema.ts` - Complete database schema and TypeScript types

**Configuration Files:**
- `vite.config.ts` - Frontend build configuration (do not modify)
- `tailwind.config.ts` - Styling configuration
- `drizzle.config.ts` - Database ORM configuration

### Important Development Notes

**Testing the Application:**
1. Start with access code `ACME2024` for Acme Corporation (full program access)
2. Try `TECH2024` for TechStart Inc (SimpleWellbeing + SimpleBehavioural)
3. Test `GHS2024` for Global Health Systems (all programs)
4. Admin panel access: Navigate to `/admin` route

**Database Storage Toggle:**
The app currently uses in-memory storage (`MemStorage`) which includes realistic seed data. To switch to PostgreSQL:

```typescript
// In server/storage.ts, change this line:
export const storage = new MemStorage();

// To this:
export const storage = new DatabaseStorage();
```

**Critical Dependencies:**
- All UI components are from shadcn/ui (Radix UI)
- Routing uses wouter (not React Router)
- Forms use React Hook Form + Zod validation
- API calls use TanStack Query with custom fetcher
- Database uses Drizzle ORM (not Prisma)

### Production Deployment

**Environment Setup:**
- Set `NODE_ENV=production`
- Configure production PostgreSQL database
- Update `DATABASE_URL` for production database
- Run `database-setup.sql` on production database

**Build Process:**
```bash
npm run build
npm run preview  # Test production build locally
```

**Production Considerations:**
- Images and file uploads will need cloud storage integration
- Vimeo URLs require Vimeo API integration for video management
- Email notifications need email service configuration
- SSL certificates required for HTTPS
- Consider CDN for static assets

**Security for Production:**
- Change default admin credentials
- Implement proper password hashing
- Add rate limiting for API endpoints
- Validate and sanitize all file uploads
- Set up proper CORS policies

---

## 🔐 **Client Access System**

### Access Page Logic
The application starts with a secure access code entry system located in `/pages/home.tsx`:

**User Flow:**
1. Client enters their unique access code
2. System validates against the `clients` table in the database
3. Successful validation redirects to the client dashboard
4. Invalid codes show error messages

**Authentication Process:**
- Access codes are stored in the `access_code` field of the `clients` table
- Each client has a unique access code (e.g., "ACME2024", "TECH2024")
- No traditional login/password - access is purely code-based for simplicity
- Session management maintains client state throughout the session

**Security Features:**
- Unique access codes prevent unauthorized access
- Server-side validation ensures data integrity
- Session-based authentication for continued access

---

## 👤 **Client Dashboard Experience**

### Client Information Display
Located in `client/src/components/client-dashboard.tsx`, the dashboard presents comprehensive client information:

**Header Section:**
- **Client Logo**: Displays from `clients.logo_url` field (left side)
- **Client Name**: Primary heading from `clients.name`
- **Eligibility Language**: Descriptive text from `clients.eligibility_language`
- **Client Code**: Purple-coded badge displaying `clients.client_code` (e.g., "ACME-MSK-2024")
- **Landing Page URL**: Clickable link from `clients.landing_page_url` with globe icon
- **QR Code**: Right-side display from `clients.qr_code_url` or placeholder

**Business Logic:**
- Client codes are color-coded for easy identification (purple badges)
- Landing page URLs are automatically formatted (removes https:// for display)
- QR codes default to placeholder if not provided
- All information is pulled from the database in real-time

### Communications Toolkit Description
Static informational section explaining:
- Purpose of the communications toolkit
- How materials are customized specifically for each client
- Contact information for support (account.support@simpletherapy.com)
- Strategic importance of consistent messaging

---

## 🎯 **Program Selection System**

### Program Selector Logic
Located in `client/src/components/program-selector.tsx`:

**Program Access Control:**
- Each client has an `active_programs` array field in the database
- Only programs in this array are displayed as selectable options
- Programs include: SimpleMSK, SimpleEAP, SimpleBehavioural, SimpleWellbeing
- Visual representation uses official SimpleTherapy program logos

**Program Display:**
- Clean, logo-only buttons with subtle shadows
- Active/selected programs show enhanced visual feedback
- Programs are dynamically loaded based on client permissions
- Invalid or inactive programs are automatically hidden

**Program Logos:**
- SimpleMSK: `https://www.simpletherapy.com/images/site/SimpleMSK/logo_brands.svg`
- SimpleEAP: `https://www.simpletherapy.com/images/site/SimpleEAP/st-logo_brands.svg`
- SimpleBehavioural: `https://www.simpletherapy.com/images/site/SimpleBehavioral/brandMain.svg`
- SimpleWellbeing: `https://www.simpletherapy.com/images/site/SimpleWellbeing/st-logo_brands.svg`

---

## 🌐 **SimpleEAP External Platform Integration**

### Special Handling for SimpleEAP
**Business Requirement:** SimpleEAP assets are hosted on an external platform and should not display internal categories/assets.

**Implementation Logic:**
1. When client selects "SimpleEAP" program, system checks `selectedProgram === 'SimpleEAP'`
2. Instead of showing asset categories, displays `SimpleEAPCard` component
3. Card shows professional branding with SimpleEAP logo and messaging
4. "Access SimpleEAP Toolkit" button generates dynamic URL
5. URL format: `https://mysupportportal.com/communications-toolkit?group_code={cualincCode}`
6. `cualincCode` is pulled from `clients.cualinc_code` field
7. Link opens in new tab for seamless external platform access

**External Platform Card Features:**
- Gradient blue background for professional appearance
- SimpleEAP branding and logo prominence
- Clear call-to-action messaging
- Dynamic URL generation using client's Cualinc code
- Fallback to sample code if client code not available

---

## 📚 **Asset Categories System**

### Dynamic Category Display
Categories are completely dynamic and configurable through the admin panel:

**Category Structure:**
- **Database Source**: `asset_categories` table
- **Program Assignment**: Each category has `program_types` array
- **Display Logic**: Only categories matching selected program are shown
- **Ordering**: Categories display based on `display_order` field

**Default Categories:**
1. **Intro Materials** (Green styling)
   - Slug: "intro-materials"
   - Icon: Clock
   - Purpose: Overview materials to get started
   
2. **Launch Campaign** (Red/Secondary styling)
   - Slug: "launch-campaign" 
   - Icon: Rocket
   - Purpose: Essential program introduction materials
   
3. **Ongoing Promotion** (Blue styling)
   - Slug: "ongoing-promotion"
   - Icon: Rotate arrows
   - Purpose: Continuous engagement materials
   
4. **Videos** (Purple styling)
   - Slug: "videos"
   - Icon: Video play
   - Purpose: Educational and promotional video content

**Category Filtering Logic:**
```javascript
const getCategoryName = (categoryId) => {
  // Maps database IDs to internal category names
  // IDs 1,5,9,13 = "intro"
  // IDs 2,6,10,14 = "launch" 
  // IDs 3,7,11,15 = "ongoing"
  // IDs 4,8,12,16 = "videos"
}
```

### Category Visual Design
Each category section includes:
- **Header**: Icon + Category name + Description
- **Color Coding**: Unique background colors for easy identification
- **Asset Type Filters**: Dynamic buttons showing available asset types
- **Asset Grid**: Responsive grid layout for asset cards

---

## 🌍 **Language Toggle System**

### Multilingual Asset Support
**Supported Languages:**
- English (🇺🇸) - Default language
- Spanish (🇪🇸) - Secondary language

**Language Filtering Logic:**
```javascript
const languageMatch = (() => {
  if (selectedLanguage === "English") {
    return asset.language === "English" || asset.language === "english" || !asset.language;
  } else if (selectedLanguage === "Spanish") {
    return asset.language === "Spanish" || asset.language === "spanish";
  }
  return true;
})();
```

**Database Structure:**
- Primary assets stored in `asset_templates` table
- Language variants stored in `asset_language_versions` table
- Relationship: `template_id` links to parent asset
- Each language version can have different `download_url` and `vimeo_url`

**User Experience:**
- Language selector appears after program selection (except SimpleEAP)
- Changing language immediately filters and updates all visible assets
- No page reload required - dynamic filtering
- Assets without language variants default to English

---

## 🎴 **Asset Cards System**

### Asset Card Design & Data Flow
Located in `client/src/components/asset-card.tsx`:

**Data Sources:**
- **Primary Data**: `asset_templates` table
- **Category Info**: Joined from `asset_categories` table  
- **Language Versions**: From `asset_language_versions` table
- **Client Customization**: From `client_assets` table

**Card Visual Elements:**

**1. Header Section:**
- **Title**: Asset name from `asset_templates.name`
- **Category Badge**: Shows "Category • Type" (e.g., "Email • Launch")
- **Language Badge**: 
  - English assets: Blue badge
  - Spanish assets: Orange badge
- **Version Badge**: Green badge showing version number

**2. Content Area:**
- **Description**: From `asset_templates.description`
- **File Type Indicator**: Shows file extension (PDF, PNG, PPTX, etc.)
- **Asset Type Icon**: Visual indicator based on asset type

**3. Action Buttons:**
Asset cards have different CTAs based on asset type:
- **Documents**: "Download Document"
- **Images**: "Download Image" 
- **Videos**: "Watch Video" + "Download Video" (dual buttons)
- **Presentations**: "Download Presentation"
- **Webinars**: "Watch Webinar" + "Download Materials"
- **Email Templates**: "Download Template"

**4. Video Asset Special Handling:**
- **Vimeo Integration**: `vimeo_url` field for embedded video links
- **Download Option**: `download_url` for downloadable video files
- **Dual Buttons**: "Watch Video" opens Vimeo, "Download" gets file
- **Play Icon**: Special video play icon overlay

**Card Design Variations:**
- **Standard Assets**: Clean white cards with subtle shadows
- **Video Assets**: Enhanced with play button overlays
- **Webinar Assets**: Special "webinar" badge and dual action buttons
- **Multi-language Assets**: Language-specific badges and content

---

## 🔍 **Asset Filtering System**

### Type-Based Filtering
Each category section includes dynamic asset type filters:

**Filter Generation Logic:**
```javascript
const getAssetTypesForCategory = (assets) => {
  const types = Array.from(new Set(assets.map(asset => asset.type)));
  return types.sort();
};
```

**Filter Display:**
- **"All" Button**: Shows total count for category
- **Type Buttons**: Individual buttons for each asset type with counts
- **Active State**: Different styling for currently selected filter
- **Dynamic Counts**: Real-time count updates based on available assets

**Filter Categories:**
- **Documents**: PDFs, Word docs, guides
- **Images**: PNGs, JPEGs, infographics, posters
- **Videos**: MP4s, webinars, educational content
- **Presentations**: PowerPoint, slide decks
- **Email Templates**: HTML email layouts
- **Newsletters**: Newsletter inserts and templates

**Color-Coded Filter Sections:**
- **Launch**: Red border on filter container
- **Intro**: Green border on filter container
- **Ongoing**: Blue border on filter container  
- **Videos**: Purple border on filter container

---

## ⚙️ **Admin Panel System**

### Administrative Interface
Located in `client/src/components/admin-panel.tsx`:

**Admin Panel Sections:**
1. **Client Management**
2. **Asset Categories Management** 
3. **Asset Templates Management**

### Client Management

**Add New Client Feature:**
Comprehensive form with conditional field validation:

**Required Fields:**
- **Client Name**: Organization name
- **Client ID**: Unique SimpleTherapy identifier (e.g., "ST-001")
- **Contact Email**: Primary contact for the client
- **Client Code**: Unique code from SimpleTherapy's client list
- **Eligibility Language**: Custom eligibility text
- **Active Programs**: Multi-select checkboxes

**Conditional Required Fields:**
- **Cualinc Code**: Only required when SimpleEAP is selected
- **Marquee Code**: Only required when SimpleWellbeing is selected

**Optional Fields:**
- **Landing Page URL**: Custom redirect URL

**Smart Form Logic:**
```javascript
// Dynamic field visibility
{selectedPrograms.includes('SimpleEAP') && (
  <div>
    <Label>Cualinc Code <span className="text-red-500">*</span></Label>
    <Input required />
  </div>
)}

{selectedPrograms.includes('SimpleWellbeing') && (
  <div>
    <Label>Marquee Code <span className="text-red-500">*</span></Label>
    <Input required />
  </div>
)}
```

**Client Display Table:**
Comprehensive table showing all client information:

**Columns:**
- **Client**: Organization name
- **Client ID**: Blue-coded badge
- **Client Code**: Purple-coded badge  
- **Cualinc Code**: Orange-coded badge
- **Marquee Code**: Green-coded badge
- **Active Programs**: Badge array showing enabled programs
- **Access Code**: Gray-coded unique access identifier
- **Landing Page**: Clickable URL links
- **Status**: Active/Inactive status badge
- **Actions**: Edit/Delete buttons

### Asset Template Management

**Add New Asset Feature:**
Comprehensive asset creation with advanced options:

**Basic Information:**
- **Asset Name**: Descriptive title
- **Asset Category**: Dropdown from `asset_categories`
- **Asset Type**: Document, Image, Video, Presentation, etc.
- **File Type**: PDF, PNG, MP4, PPTX, etc.
- **Description**: Detailed asset description

**Advanced Options:**

**1. Asset Scope:**
- **Template**: Available to all clients (customized per client)
- **Client-Specific**: Assigned directly to specific clients

**2. Version Management:**
- **New Assets**: Always start at version 1.0
- **Version Increments**: Automatic increment for new versions
- **Shared Versioning**: Same version number across language variants

**3. Language Support:**
- **Primary Language**: Default English version
- **Add Language Versions**: Spanish variants with separate URLs
- **Language-Specific URLs**: Different download/Vimeo URLs per language

**4. URL Configuration:**
- **Download URL**: Direct file download link
- **Vimeo URL**: For video assets with embedded players

**Asset Upload Logic:**
```javascript
// Version management
const newAsset = {
  ...formData,
  version: isNewTemplate ? "1.0" : incrementVersion(existingVersion),
  categoryId: selectedCategory,
  is_template: scope === "template",
  scope: scope
};
```

**Asset Template Display:**
- **Searchable Table**: Real-time search functionality
- **Category Filtering**: Filter by asset category
- **Type Indicators**: Visual indicators for asset types
- **Version Display**: Current version numbers
- **Action Buttons**: Edit, Delete, Add Language Version

### Category Management

**Add New Category:**
- **Category Name**: Display name (e.g., "Intro Materials")
- **Category Slug**: URL-friendly identifier (e.g., "intro-materials")
- **Description**: Purpose and usage description
- **Program Assignment**: Multi-select for applicable programs
- **Display Order**: Numeric ordering for category display

**Category Display Logic:**
Categories are dynamically filtered based on:
- Selected program type
- Display order preference
- Active/inactive status

---

## 🗄️ **Database Relationships & Schema**

### Core Tables

**1. Clients Table:**
```sql
- id (Primary Key)
- name (Organization name)
- access_code (Unique access identifier)
- client_id (SimpleTherapy client ID)
- client_code (Client-specific code)
- cualinc_code (SimpleEAP integration code)
- marquee_code (SimpleWellbeing integration code) 
- contact_email (Primary contact)
- landing_page_url (Custom redirect URL)
- logo_url (Client branding logo)
- qr_code_url (Client-specific QR code)
- eligibility_language (Custom eligibility text)
- active_programs (Array of enabled programs)
- status (active/inactive)
```

**2. Asset Categories Table:**
```sql
- id (Primary Key)
- name (Display name)
- slug (URL-friendly identifier)
- description (Category purpose)
- program_types (Array of applicable programs)
- display_order (Sort order)
```

**3. Asset Templates Table:**
```sql
- id (Primary Key)
- name (Asset title)
- category_id (Foreign Key to asset_categories)
- type (Asset type: document, image, video, etc.)
- file_type (File extension: pdf, png, mp4, etc.)
- version (Version number: 1.0, 1.1, etc.)
- description (Asset description)
- download_url (Direct download link)
- vimeo_url (Video embed URL)
- is_template (Boolean: template vs client-specific)
- scope (template/client-specific)
```

**4. Asset Language Versions Table:**
```sql
- id (Primary Key)
- template_id (Foreign Key to asset_templates)
- language (English/Spanish)
- download_url (Language-specific download)
- vimeo_url (Language-specific video)
```

**5. Client Assets Table:**
```sql
- id (Primary Key)
- client_id (Foreign Key to clients)
- template_id (Foreign Key to asset_templates)
- customized_url (Client-specific customized version)
- download_count (Usage tracking)
- last_downloaded (Timestamp)
```

### Relationship Logic

**Client → Programs → Categories → Assets Flow:**
1. Client has `active_programs` array
2. Categories filter by `program_types` matching client's active programs
3. Assets display based on category assignment
4. Language versions provide multilingual support

**Asset Customization Flow:**
1. Template assets serve as base content
2. Client-specific customizations stored in `client_assets`
3. Language versions provide localized content
4. Download tracking maintains usage analytics

---

## 🔧 **Business Logic & Rules**

### Program Access Control
- Clients only see programs in their `active_programs` array
- SimpleEAP clients bypass internal asset system
- Program selection drives category and asset visibility

### Asset Version Management
- New templates start at version 1.0
- Manual version increments for significant updates
- Language versions share the same version number
- Version history maintained for audit purposes

### Language Support Rules
- English is the default/fallback language
- Spanish versions are optional enhancements
- Assets without language variants default to English
- Language selection filters all visible assets

### SimpleEAP Integration Rules
- SimpleEAP clients require `cualinc_code` for external platform access
- External platform URL: `https://mysupportportal.com/communications-toolkit?group_code={cualinc_code}`
- No internal assets displayed for SimpleEAP selection
- Professional redirection card with clear messaging

### SimpleWellbeing Integration Rules
- SimpleWellbeing clients require `marquee_code` for platform features
- Marquee codes enable display system integration
- Standard internal asset display maintained

### Asset Type Handling Rules
- **Videos**: Dual action buttons (Watch/Download)
- **Webinars**: Special "webinar" badge and dual actions
- **Documents**: Single download action
- **Images**: Single download action with preview capability
- **Presentations**: Download with file type indicators

---

## 🎨 **Design System & Styling**

### Color Coding System
**Client Codes:**
- Client ID: Blue (`bg-blue-50`, `text-blue-700`)
- Client Code: Purple (`bg-purple-50`, `text-purple-700`)
- Cualinc Code: Orange (`bg-orange-50`, `text-orange-700`)
- Marquee Code: Green (`bg-green-50`, `text-green-700`)
- Access Code: Gray (`bg-gray-100`)

**Category Colors:**
- Intro Materials: Green (`bg-green-600`)
- Launch Campaign: Red/Secondary (`bg-secondary`)
- Ongoing Promotion: Blue (`bg-blue-600`)
- Videos: Purple (`bg-purple-600`)

**Language Badges:**
- English: Blue badges
- Spanish: Orange badges
- Version: Green badges

### Responsive Design
- **Mobile-First**: Tailwind CSS responsive utilities
- **Grid Layouts**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Flexible Cards**: Responsive asset card sizing
- **Navigation**: Collapsible admin panel sections

---

## 🚀 **Performance & Optimization**

### Database Optimization
- **Indexes**: Performance indexes on frequently queried fields
- **Views**: Simplified asset and client data queries
- **Triggers**: Automatic timestamp updates
- **Constraints**: Data integrity enforcement

### Frontend Optimization
- **React Query**: Intelligent caching and background updates
- **Dynamic Loading**: Components load only when needed
- **Image Optimization**: Lazy loading for asset previews
- **State Management**: Efficient state updates and re-renders

### API Performance
- **Filtered Queries**: Only fetch relevant data based on client/program
- **Pagination**: Large asset collections handled efficiently
- **Caching**: Strategic caching for frequently accessed data

---

## 🔒 **Security Considerations**

### Access Control
- **Code-Based Authentication**: Simple but secure access code system
- **Session Management**: Secure session handling
- **Role-Based Access**: Admin vs client permissions

### Data Protection
- **Input Validation**: Zod schemas for all form inputs
- **SQL Injection Prevention**: Parameterized queries through Drizzle ORM
- **XSS Protection**: Sanitized content rendering

### External Platform Security
- **Secure Redirects**: Validated external URLs
- **Client Code Protection**: Secure transmission of integration codes
- **HTTPS Enforcement**: Secure communication protocols

---

## 📊 **Analytics & Tracking**

### Usage Metrics
- **Download Tracking**: `client_assets.download_count`
- **Last Access**: `client_assets.last_downloaded`
- **Popular Assets**: Most downloaded assets by category/program
- **Client Engagement**: Active vs inactive client identification

### Business Intelligence
- **Program Performance**: Asset usage by program type
- **Language Preferences**: English vs Spanish usage patterns
- **Category Effectiveness**: Most popular asset categories
- **Client Behavior**: Access patterns and preferences

---

## 🛠️ **Maintenance & Future Enhancements**

### Current Architecture Benefits
- **Scalable Database Design**: Easy to add new programs, categories, and asset types
- **Modular Components**: Individual features can be updated independently
- **API-First Design**: Easy integration with external systems
- **Comprehensive Logging**: Built-in tracking and analytics

### Planned Enhancement Areas
- **Advanced Analytics Dashboard**: Detailed usage reporting
- **Bulk Operations**: Mass asset uploads and updates
- **Custom Asset Requests**: Client-initiated asset modification requests
- **Email Integration**: Automated notifications and updates
- **Advanced Search**: Full-text search across assets and descriptions

### Development Guidelines
- **TypeScript**: Maintain strict typing for all components
- **Component Isolation**: Keep components focused and reusable
- **Database Migrations**: Use proper migration system for schema changes
- **Error Handling**: Comprehensive error handling and user feedback
- **Testing**: Maintain test coverage for critical business logic

---

## 📞 **Support & Contact Information**

### Technical Support
- **Account Support**: account.support@simpletherapy.com
- **Platform Issues**: Report through admin panel or direct contact
- **Integration Support**: Available for external platform connections

### Business Support
- **Program Questions**: Contact assigned account manager
- **Custom Asset Requests**: Submit through support channels
- **New Client Onboarding**: Guided setup process available

---

This comprehensive documentation covers every aspect of the SimpleTherapy Communications Toolkit Platform, from user-facing features to technical implementation details. The platform is designed to be scalable, maintainable, and user-friendly while supporting complex business requirements for multi-program, multilingual asset management and distribution.