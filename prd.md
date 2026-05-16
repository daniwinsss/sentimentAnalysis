Sentilytics - AI Powered Sentiment Analysis Platform

Academic NLP + ML project with a modern SaaS-style UI.

1. Executive Summary
Sentilytics is a web-based NLP platform that analyzes user text (reviews, tweets,
feedback, comments) and predicts sentiment (positive, negative, neutral). It
combines an academically strong ML pipeline with a polished full-stack product.

2. Goals and Non-Goals
Goals
- Demonstrate an end-to-end NLP pipeline with clear evaluation.
- Provide a premium, investor-demo quality SaaS UI.
- Deliver fast, reliable sentiment predictions with analytics and history.

Non-Goals
- Multilingual sentiment analysis in MVP.
- Real-time social stream ingestion.
- Fully automated model retraining and A/B experimentation.

3. Target Users
User Type | Use Case
Students | Learn NLP
Researchers | Analyze sentiment
Businesses | Customer feedback
Social Media Analysts | Public opinion tracking

4. MVP Scope and Phases
MVP (Phase 1)
- Authentication (signup/login), protected routes.
- Single text sentiment analysis with confidence score.
- Batch CSV analysis with download.
- Sentiment history (view, search, delete).
- Analytics dashboard: sentiment distribution, trends, recent analyses.
- Traditional ML models: Naive Bayes, Logistic Regression.

Phase 2
- SVM model and model comparison dashboard.
- Optional dark mode toggle.
- Advanced analytics (model-level metrics, accuracy over time).

Phase 3
- BERT model and model switching in UI.
- AI-generated insights and report export.
- Live typing analysis and enhanced micro-interactions.
- Admin panel for usage monitoring and dataset management.

5. Functional Requirements
5.1 Authentication
Features
- User signup/login
- JWT authentication
- Password hashing
- Protected routes
Frontend Pages
- Login
- Signup
Backend
- Auth APIs
- Token validation middleware

5.2 Single Text Sentiment Analysis
User Flow
- User enters text
- Clicks Analyze
- Model predicts sentiment
- Confidence score displayed
Backend Logic
- Preprocess text
- Vectorize input
- Predict sentiment
- Return probabilities

5.3 Batch CSV Analysis
Features
- Upload CSV file
- Analyze multiple reviews
- Download analyzed CSV
CSV Example
Input: Review
Output: Review, Sentiment

5.4 Analytics Dashboard
Features
- Sentiment distribution
- Pie charts
- Line graphs
- Recent analyses
- Accuracy metrics (model-level summary)
Visualizations
- Positive vs Negative percentage
- Prediction trends

5.5 Model Comparison (Phase 2)
Compare
- Naive Bayes
- Logistic Regression
- SVM
Metrics
- Accuracy
- Precision
- Recall
- F1-score

5.6 Sentiment History
Features
- Save previous analyses
- Search and filter history
- Delete history

5.7 Admin Panel (Phase 3)
Features
- View all users
- Monitor API usage
- Dataset management

6. Data and ML Requirements
6.1 Dataset Plan
- Define dataset source(s) and license.
- Provide labeling assumptions and class balance.
- Split: train/validation/test with fixed random seed.
- Preserve a small gold set for regression checks.

6.2 NLP Pipeline
Text Preprocessing
- Lowercase conversion
- Punctuation removal
- Stopword removal
- Stemming or lemmatization
Feature Extraction
- TF-IDF vectorization

6.3 Models
Traditional ML (MVP)
- Naive Bayes
- Logistic Regression
Phase 2
- SVM
Phase 3
- BERT

6.4 Evaluation and Reproducibility
- Define baseline metrics for MVP (min F1, accuracy).
- Report precision/recall/F1 per class.
- Capture confusion matrix for the test set.
- Record training config and random seeds.

7. System Architecture
React Frontend
       |
Node.js Gateway API
       |
Python ML Service (FastAPI)
       |
ML Models
       |
MongoDB Database

8. API Contracts (High-Level)
General Rules
- Standard JSON responses with status and data fields.
- Consistent error shape with code and message.
- Pagination for list endpoints (page, limit).

Auth APIs
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/profile

Sentiment APIs
- POST /api/analyze
- POST /api/analyze/batch

History APIs
- GET /api/history
- DELETE /api/history/:id

Analytics APIs
- GET /api/analytics/overview
- GET /api/analytics/model-comparison

9. Frontend Requirements
Frontend Goals
- Modern, minimal, premium SaaS look
- Black and white aesthetic as default theme
- Smooth animations and investor-demo quality

Frontend Stack
Purpose | Tech
Framework | React
Styling | Tailwind CSS
Components | shadcn/ui
Animations | Framer Motion
Charts | Recharts
State Management | Zustand or Context API
API Calls | Axios
Routing | React Router

Frontend Pages
1) Landing Page
- Hero section, features, NLP explanation, demo preview, CTAs
- Glassmorphism, large typography, gradient highlights

2) Authentication Pages
- Login, signup, validation, error handling

3) Dashboard
- Sidebar, top navbar, analytics cards, charts, activity feed
- Sentiment card, accuracy graph, pie chart, recent predictions

4) Sentiment Analyzer Page
- Large text area, analyze button, result card, confidence meter
- Character counter

5) Batch Upload Page
- Drag and drop CSV upload, upload progress, results table, download

6) History Page
- Search, filter by sentiment, pagination, delete entries

Frontend UX Requirements
- Responsive design, mobile friendly
- Loading skeletons
- Error states
- Toast notifications

10. Non-Functional Requirements
- Prediction latency target (P95) for single text analysis.
- Throughput target for batch analysis.
- Basic uptime goal for demo readiness.
- Logging and monitoring for API errors and model failures.

11. Security and Privacy Requirements
- JWT expiry and refresh strategy.
- Password reset and email verification (Phase 2).
- Rate limiting on auth and analysis endpoints.
- CSV validation and size limits.
- PII handling and data retention policy.

12. Success Metrics
Product
- Time-to-first-analysis below a defined threshold.
- User retention across first 7 days.
- API error rate below defined target.

ML
- MVP minimum F1 and accuracy thresholds.
- Stable confidence calibration on validation set.

UX
- Responsive layout with no critical mobile breakpoints.

13. Backend and ML Service Details
Backend Stack
Purpose | Tech
Runtime | Node.js
Framework | Express.js
ML Service | FastAPI
Database | MongoDB
ORM | Mongoose
Authentication | JWT
File Uploads | Multer
Validation | Zod or Joi

ML Service Responsibilities
- Traditional model APIs: POST /predict/traditional
- BERT APIs (Phase 3): POST /predict/bert
ML Workflow
Input Text -> Preprocessing -> TF-IDF or Tokenization -> Prediction -> Confidence

14. Data Schemas (High-Level)
User
{
  name,
  email,
  password,
  createdAt
}

Analysis
{
  userId,
  text,
  sentiment,
  confidence,
  modelUsed,
  createdAt
}

15. Folder Structure
Frontend
src/
  pages/
  components/
  layouts/
  hooks/
  services/
  store/
  utils/
  animations/

Backend
backend/
  controllers/
  routes/
  middleware/
  models/
  services/
  utils/
  config/

ML Service
ml-service/
  models/
  training/
  preprocessing/
  routes/
  utils/
  saved_models/

16. Advanced Presentation Features (Phase 3)
- Typing animation
- Real-time confidence meter
- Animated charts
- AI-generated insights
- Export reports
- Model switching

17. Deployment Plan
Service | Platform
Frontend | Vercel
Backend | Render or Railway
ML Service | Render
Database | MongoDB Atlas

18. Risks and Mitigations
- Dataset bias or weak labels -> add bias checks and label validation.
- Model latency -> caching and smaller models for MVP.
- CSV misuse -> strict validation and limits.

19. Build Readiness Checklist
- Environment variables defined for all services.
- Health checks for backend and ML service.
- Smoke test for analyze and batch flows.
- CI checks for lint and basic tests.
