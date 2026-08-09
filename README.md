Here is the completely updated and highly professional `README.md` file for your repository. It replaces the generic Create React App boilerplate with a comprehensive overview of your entire ecosystem, features, and tech stack.

You can copy and paste this directly into your GitHub repository.

---

# 🌱 Krishi Chakra

**An AI-Powered Digital Agricultural Ecosystem**

Indian smallholder farmers face a dual crisis of delayed agricultural intelligence and market exploitation, worsened by poor digital literacy, language barriers, and unstable rural internet.

**Krishi Chakra** solves this by putting an autonomous digital agronomist and quality inspector directly into the farmer's pocket. Built with an offline-first architecture and powered by multimodal Generative AI, this platform democratizes access to expert-level agronomic data, fair market pricing, and government welfare schemes.

---

## 🚀 Key Innovations & Features

* **Dr. Akhil (Computer Vision Diagnostic Engine):** Processes farmer-uploaded images of infected crops using Google Gemini 2.5 Flash to instantly generate localized disease identification and a 3-step actionable treatment plan (organic and chemical).
* **Smart AgriCore 2.0:** A unified geospatial engine that cross-references physical soil health cards or manual NPK inputs with weather telemetry to forecast soil remediation and optimized crop recommendations.
* **Harvest Quality Grader:** Democratizes pricing by visually inspecting harvest images to generate an objective, Agmark-compliant grade and a strategic negotiation script in the farmer's native language.
* **Community Pest Radar:** A live proximity-based alert system that broadcasts audio warnings if critical crop threats are reported within a 10km radius.
* **Yojana Setu:** Evaluates user profile variables (land size, state, socio-economic category) to match farmers with specific Central and State welfare programs.
* **Native Vernacular Voice UI:** Eradicates the typing barrier by utilizing native browser Speech Recognition APIs mapped to regional dialects (Telugu, Hindi, English) for hands-free navigation.
* **Offline-First Resiliency:** Automatically queues user inputs and API requests during network drops in rural fields, syncing seamlessly to the cloud once network stability is restored.

---

## 🛠️ Technology Stack

**Frontend**

* React.js (Single Page Application)
* HTML5 / CSS3 (Responsive Mobile-First UI)
* Axios (Network and Offline Queue Interceptors)

**Backend & Database**

* Node.js & Express.js (RESTful API architecture)
* MongoDB Atlas (NoSQL Cloud Database)

**Artificial Intelligence & Integrations**

* Google Generative AI (`@google/generative-ai`)
* Gemini 2.5 Flash API (Vision & Text generation)
* Web Speech API (Native voice synthesis and recognition)

**Deployment**

* Vercel (Serverless edge deployment and CI/CD integration)

---

## ⚙️ Local Development Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v16.x or higher)
* npm or yarn
* MongoDB Atlas Account
* Google Gemini API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Akhilbayya297326/krishichakra-frontend.git
cd krishichakra-frontend

```


2. **Install dependencies**
```bash
npm install

```


3. **Configure Environment Variables**
Create a `.env` file in the root directory and add the following keys:
```env
REACT_APP_GEMINI_API_KEY=your_google_gemini_api_key_here
REACT_APP_BACKEND_URL=http://localhost:5000 

```


4. **Start the development server**
```bash
npm start

```


The application will be running on `http://localhost:3000`.

---

## 📦 Standard React Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). In the project directory, you can also run:

* `npm test`: Launches the test runner in interactive watch mode.
* `npm run build`: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
* `npm run eject`: Removes the single build dependency from your project. *(Note: this is a one-way operation. Once you eject, you can't go back!)*

---

## 👨‍💻 Developed By

**B. Akhil**

* Computer Science & Engineering
* Focus Area: AgriTech, AI Integration, & Full-Stack MERN Development
