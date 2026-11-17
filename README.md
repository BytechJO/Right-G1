# Right G1 — Teacher Edition

Right G1 is an interactive digital English course built with React and Vite. This repository contains the Teacher Edition, including the Student Book, Workbook, Teacher’s Book, and supporting learning materials.

## Contents

- [Requirements](#requirements)
- [Get the code](#get-the-code)
- [Run locally](#run-locally)
- [Build the website](#build-the-website)
- [Create the SCORM package](#create-the-scorm-package)
- [SCORM tracking](#scorm-tracking)
- [Project structure](#project-structure)
- [Common tasks](#common-tasks)

## Requirements

- Node.js and npm
- Windows PowerShell to run the included SCORM packaging command
- A learning management system (LMS) that accepts SCORM 1.2 packages, if you plan to publish the course

## Get the code

```bash
git clone https://github.com/BytechJO/Right-G1.git
cd Right-G1
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

## Run locally

Start the Vite development server:

```bash
npm run dev
```

Open the local address printed in the terminal. The server supports hot reload while you edit files under `src/`.

## Build the website

```bash
npm run build
```

Vite writes the production website to `dist/`. This is a regular web build; use the SCORM command below when you need an LMS package.

To preview the production build locally:

```bash
npm run preview
```

## Create the SCORM package

On Windows, run this from the repository folder:

```bash
npm run package:scorm
```

The command builds the latest source, creates the SCORM manifest, and packages the output as:

```text
release/Right-G1-Teacher-SCORM12.zip
```

The command replaces the ZIP at that path each time it runs. Upload that ZIP to your LMS or SCORM Cloud. Do not unzip it before uploading.

`dist/` and `release/` are generated folders and are ignored by Git. A fresh clone does not include the ZIP; run the command to generate it. After changing course code, run the same command again and upload the newly generated ZIP as the updated course package/version in your LMS.

## SCORM tracking

The package uses **SCORM 1.2**. It saves the learner’s current section and page so a later launch can resume from that location. It also records time spent in the session.

Completion is based on page visits across all pages in the Student Book, Workbook, and Teacher’s Book. The LMS receives `incomplete` until all three sections have been visited, then receives `completed`. This course does not send a numeric SCORM score.

## Project structure

```text
Right-G1/
├── src/                    React application and course content
│   ├── component/          Book navigation, pages, exercises, and viewers
│   └── assets/             Images, audio, and other course media
├── public/                 Static files copied into the build
├── scorm/                  SCORM 1.2 manifest template
├── scripts/                SCORM packaging script
├── dist/                   Generated web build (ignored by Git)
└── release/                Generated SCORM ZIP (ignored by Git)
```

## Common tasks

| Task | Command |
| --- | --- |
| Install dependencies | `npm ci` |
| Run the development server | `npm run dev` |
| Build the website | `npm run build` |
| Preview the website build | `npm run preview` |
| Generate or refresh the SCORM ZIP | `npm run package:scorm` |
| Run ESLint | `npm run lint` |

## Notes

- Keep source code and course assets in the repository; generated `dist/` and `release/` outputs are not committed.
- When sharing the project with another developer, share the repository. They can generate the SCORM ZIP locally by installing dependencies and running `npm run package:scorm` on Windows.
- Validate a new ZIP in a SCORM test environment before distributing it through an LMS.
