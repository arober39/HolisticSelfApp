# Holistic Self App - Health Tracker

A modern web-based health tracking application for managing ailments, symptoms, medications, and dosage logs. Built with React and JavaScript, designed with a focus on privacy and local data storage.

## Overview

Holistic Self App helps you track your health journey by allowing you to:
- Monitor multiple health conditions (ailments)
- Log symptoms with severity ratings
- Manage medications, supplements, vitamins, and herbal remedies
- Track medication dosages and adherence
- Link symptoms to medications to identify patterns
- View detailed health history and trends

## Features

### Core Functionality
- **Ailment Tracking**: Create and manage multiple health conditions with notes and timestamps
- **Symptom Logging**: Record symptoms with severity ratings (1-10 scale) and detailed notes
- **Medication Management**: Track medications, supplements, vitamins, and herbal remedies with dosage and frequency information
- **Dosage Logging**: Log medication intake with timestamps and notes
- **Symptom-Medication Linking**: Connect symptoms to medications to track effectiveness
- **Data Visualization**: View medication adherence and health trends over time

### User Experience
- **Dark Theme UI**: Modern, eye-friendly dark interface optimized for extended use
- **Responsive Design**: Works seamlessly across desktop and tablet devices
- **Local Storage**: All data stored locally in your browser - complete privacy, no cloud sync
- **Fast Performance**: Built with Vite for lightning-fast development and optimized production builds

## Technology Stack

This is a **pure JavaScript application** with no TypeScript dependencies:

- **JavaScript (ES6+)** - Modern JavaScript with ES modules
- **React 18.2** - Modern UI framework with hooks
- **React Router 6.26** - Client-side routing and navigation
- **Vite 7.2** - Next-generation build tool and dev server
- **IndexedDB** - Browser-based database for local data persistence
- **date-fns 4.1** - Modern date utility library for formatting and manipulation

## Getting Started

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** (comes with Node.js) or **yarn**

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd HolisticSelfApp
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

The development server will automatically reload when you make changes to the code.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be output to the `dist` directory, ready for deployment to any static hosting service.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

This serves the production build locally so you can test it before deploying.

## Project Structure

```
HolisticSelfApp/
├── src/
│   ├── database/
│   │   ├── database.js      # IndexedDB database manager and CRUD operations
│   │   └── models.js        # Data model definitions and constants
│   ├── screens/
│   │   ├── AilmentsListScreen.jsx      # Main screen listing all ailments
│   │   ├── AilmentDetailScreen.jsx    # Detailed view of a single ailment
│   │   ├── AddAilmentScreen.jsx       # Form to create new ailments
│   │   ├── AddSymptomScreen.jsx       # Form to log new symptoms
│   │   ├── AddMedicationScreen.jsx    # Form to add new medications
│   │   ├── SymptomDetailScreen.jsx    # Detailed view of a symptom
│   │   ├── MedicationDetailScreen.jsx # Detailed view of a medication
│   │   ├── AddDosageEntryScreen.jsx   # Form to log medication dosages
│   │   └── ScreenStyles.css           # Component-specific styles
│   ├── App.jsx              # Main app component with React Router setup
│   ├── main.jsx             # Application entry point
│   └── styles.css           # Global styles and theme
├── assets/                  # Static assets (icons, images)
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies and scripts
```

**Note**: All source files are JavaScript (`.js` and `.jsx`). There are no TypeScript files in this project.

## Data Storage & Privacy

All data is stored locally in your browser using **IndexedDB**. This means:
- ✅ **Complete Privacy**: Your health data never leaves your device
- ✅ **No Account Required**: No sign-up or login needed
- ✅ **Offline Access**: Works without an internet connection
- ✅ **Browser-Specific**: Data is tied to the browser where it's stored

**Important**: If you clear your browser data or use a different browser, your data will not be accessible. Consider exporting important information regularly if needed.

## Browser Support

This application requires a modern browser with IndexedDB support:

- ✅ Chrome/Edge (latest versions)
- ✅ Firefox (latest versions)
- ✅ Safari (latest versions)
- ✅ Opera (latest versions)

**Minimum Requirements**: Any browser that supports ES6+ JavaScript and IndexedDB API.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally

### Code Style & Architecture

This is a **pure JavaScript application** with the following characteristics:

- **Language**: JavaScript (ES6+) with ES modules
- **React**: Functional components using React Hooks
- **Styling**: CSS (no CSS-in-JS or preprocessors)
- **Architecture**: Modular component structure
- **No TypeScript**: All code is written in JavaScript - no type definitions or TypeScript configuration files

### File Conventions

- `.js` - JavaScript modules and utilities
- `.jsx` - React components
- `.css` - Stylesheets

## Migration History

This application was migrated from a React Native mobile app to a web application. The migration included:

### Platform Migration
- **React Native** → **React Web**
- **React Navigation** → **React Router**
- **Expo SQLite** → **IndexedDB**
- **React Native Paper** → **Custom CSS Components**

### Language Migration
- **TypeScript** → **JavaScript** (complete migration)
  - All `.ts` and `.tsx` files converted to `.js` and `.jsx`
  - TypeScript configuration files removed
  - TypeScript type definition dependencies removed
  - Pure JavaScript implementation with no type checking

The core functionality and data models remain consistent, ensuring a familiar experience for users migrating from the mobile version.

## Dependencies

### Production Dependencies
- `react` ^18.2.0 - React library
- `react-dom` ^18.2.0 - React DOM renderer
- `react-router-dom` ^6.26.0 - Client-side routing
- `date-fns` ^4.1.0 - Date utility library

### Development Dependencies
- `vite` ^7.2.2 - Build tool and dev server
- `@vitejs/plugin-react` ^4.2.0 - Vite plugin for React

**Note**: No TypeScript-related dependencies are included in this project.

## Future Enhancements

Potential features for future development:
- Data export/import functionality
- Medication reminders and notifications
- Advanced analytics and reporting
- Multi-device sync (optional, user-controlled)
- Printable reports for healthcare providers

## License

This is a private project. All rights reserved.

## Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

---

**Version**: 1.0.0  
**Language**: JavaScript (ES6+)  
**Last Updated**: 2024
