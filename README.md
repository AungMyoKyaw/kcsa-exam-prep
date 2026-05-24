# KCSA Exam Prep Interactive Book

> An interactive study companion for the Kubernetes and Cloud Native Security Associate (KCSA) certification exam.

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://aungmyokyaw.github.io/kcsa-exam-prep/)

🔗 **Live Site:** [https://aungmyokyaw.github.io/kcsa-exam-prep/](https://aungmyokyaw.github.io/kcsa-exam-prep/)

## About

This is an interactive web application designed to help you prepare for the [KCSA certification](https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa/) exam. It covers all 6 exam domains with quizzes, practice exams, a cheat sheet, and a glossary.

## Exam Domains

| Domain | Title | Weight |
|--------|-------|--------|
| 1 | Overview of Cloud Native Security | 14% |
| 2 | Kubernetes Cluster Component Security | 22% |
| 3 | Kubernetes Security Fundamentals | 22% |
| 4 | Kubernetes Threat Model | 16% |
| 5 | Platform Security | 16% |
| 6 | Compliance and Security Frameworks | 10% |

## Features

- 📚 **Domain-based Learning** – Study each of the 6 exam domains with interactive quizzes
- 📝 **Practice Exam** – Simulated exam environment with multiple questions
- 📖 **Cheat Sheet** – Quick reference for key concepts
- 🔤 **Glossary** – Security and Kubernetes terminology
- ⚙️ **Settings** – Customize your study experience

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vitejs.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (40+ components)
- [React Router](https://reactrouter.com/)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/AungMyoKyaw/kcsa-exam-prep.git
cd kcsa-exam-prep

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This project is automatically deployed to **GitHub Pages** via GitHub Actions on every push to `main`.

## License

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
