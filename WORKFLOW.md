# AI Workflow Comparison

## Overview

For this assignment, I implemented the same settings form feature twice using two different AI prompting approaches. The objective was to compare how prompt quality affects the quality of the generated code and the overall development workflow.

## Round 1 – Vague Prompt

In the first round, I used a single, vague prompt: "Create a settings form with validation." I accepted the generated code with minimal changes and saved it in the `assignment2-round1` branch.

The generated implementation was functional but lacked structure and detailed guidance. Since the prompt did not specify accessibility, project organization, or verification requirements, the AI made several assumptions about the implementation.

## Round 2 – Structured Prompt

For the second round, I started from a fresh branch and a completely new AI session. This time I provided detailed requirements, including the project structure, expected files, validation rules, accessibility requirements, implementation planning, and a verification checklist before considering the task complete.

The AI first explained its implementation plan before generating the code. The resulting implementation was more organized, easier to understand, and better aligned with the requested requirements.

## Comparison

Comparing the two branches showed several concrete improvements. The second implementation had a cleaner project structure, better semantic HTML, clearer component organization, stronger validation logic, improved accessibility, and a more maintainable codebase. The generated code also followed the requested constraints more closely.

Although writing the detailed prompt took longer initially, it reduced the amount of manual review and clarification needed afterward. The overall development process was more efficient because the AI had fewer opportunities to make incorrect assumptions.

## AI Mistake I Caught

One issue I noticed was that the AI initially made implementation assumptions that were not explicitly requested. During review, I verified that the generated code matched the requirements and confirmed the validation behavior before committing the changes. This reinforced the importance of reviewing AI-generated code instead of accepting it without verification.

## Lessons Learned

This exercise demonstrated that effective AI-assisted development depends more on clear specifications than on the AI itself. Providing implementation constraints, planning steps, verification instructions, and accessibility requirements produced a higher-quality result while reducing review effort. Going forward, I will use structured prompts and verification as part of my standard development workflow.