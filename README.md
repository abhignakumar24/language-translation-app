# Language Translator

A modern, feature-rich language translation web application built with Next.js and TypeScript. This application provides real-time text translation between multiple languages with a beautiful, responsive user interface.

## Features

- 🌐 **Multi-language Support**: Translate between 20+ languages
- 🔊 **Text-to-Speech**: Listen to translations with voice selection
- 🎯 **Auto Language Detection**: Automatically detect input language
- 📋 **Copy to Clipboard**: Easy copying of translated text
- 🌓 **Dark/Light Mode**: Support for both dark and light themes
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🔄 **English Preview**: See English translations for non-English languages
- 🎙️ **Voice Selection**: Choose from multiple voices for pronunciation
- 🎨 **Modern UI**: Clean and intuitive user interface

## Supported Languages

- English
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Chinese
- Japanese
- Korean
- Arabic
- Hindi
- Telugu
- Malayalam
- Tamil
- Turkish
- Dutch
- Polish
- Swedish
- Danish
- Finnish
- Greek
- Czech

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Speech**: Web Speech API

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhignakumar24/language-translation-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd language-translation-app
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env.local` file in the root directory and add your API keys:
   ```env
   NEXT_PUBLIC_TRANSLATION_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter text in the source language field
2. Select the target language from the dropdown
3. Click "Translate" to get the translation
4. Use the speaker icon to hear the pronunciation
5. Use the copy icon to copy the translated text
6. Toggle between dark and light mode using the theme switch

## Features in Detail

### Text-to-Speech
- Click the speaker icon to hear the pronunciation
- Choose from multiple voices for each language
- Use the default voice or select a specific one
- Stop speaking by clicking the speaker icon again

### Language Detection
- Automatically detects the input language
- Shows the detected language below the source text
- Updates the source language if different from detected

### Copy to Clipboard
- One-click copy functionality
- Visual feedback when text is copied
- Works for both source and translated text

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## Contact

Abhigna Kumar - abhignakumar123@gmail.com

Project Link: [https://github.com/abhignakumar24/language-translation-app](https://github.com/abhignakumar24/language-translation-app)
