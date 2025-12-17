# Roadmap Priorities

Prioritization approach: value/effort mix using tiers. Focus first on high user impact with low-to-medium complexity, then platform reliability.

## P0 (High Value, Low/Medium Effort)

- PDF Viewer upgrade — Value: 5, Effort: M
  - Replace iframe with React-PDF (pdfjs-dist) and add basic toolbar (zoom, page nav, loading states).
- Upload UX improvements — Value: 5, Effort: M
  - Drag-and-drop, progress indicator, cancel via AbortController, size/type validation.
- Public file serving — Value: 4, Effort: S
  - Ensure `express.static` mapping for uploads and stable URLs.
- Client-side caching (React Query) — Value: 4, Effort: M
  - Integrate React Query for document lists/details with background refetch.
- Server pagination — Value: 4, Effort: M
  - Implement for documents and chat history.

## P1 (High Value, Medium Effort)

- Document metadata & search — Value: 4, Effort: M
  - Tags/categories and search by title/tags.
- Dashboard activity & streaks — Value: 4, Effort: M
  - Real logs backing streaks; filters and deep links for recent activity.
- Flashcards enhancements — Value: 4, Effort: M
  - Bulk actions, spaced repetition scheduling; keep set count and (optional) total cards counter.
- Quizzes results view — Value: 4, Effort: M
  - Detailed results with explanations and weak areas.
- Accessibility (viewer/modals) — Value: 3, Effort: S
  - Keyboard navigation; ARIA labels and roles.

## P2 (Medium Value or Higher Effort)

- PDF.js default viewer — Value: 3, Effort: M/L
  - Full toolbar (search/print/download) if needed.
- Analytics & Observability — Value: 3, Effort: M
  - Error boundaries, granular toasts, request logging, correlation IDs.
- Storage migration (S3) — Value: 4, Effort: L
  - Signed URLs and lifecycle policies.
- Queueing (BullMQ) — Value: 3, Effort: M/L
  - Heavy jobs (PDF processing, AI generation).
- Social & Collaboration (initial) — Value: 3, Effort: M
  - Document comments, shared study groups.

## Notes

- Reassess quarterly; move items between tiers based on user feedback and technical constraints.
- For sprint planning, estimate effort (S/M/L) and apply a simple Value/Effort score to refine ordering within each tier.

---

## Sprint Plan (Next 3 Sprints)

- Sprint 1 (Foundations & UX polish)

  - Public file serving (Value 4 / Effort S)
  - PDF Viewer upgrade (Value 5 / Effort M)
  - Upload UX improvements (Value 5 / Effort M)
  - Accessibility quick wins (viewer/modals) (Value 3 / Effort S)
  - Rationale: Immediate user-visible improvements and reliable file delivery.

- Sprint 2 (Performance & Data hygiene)

  - Client-side caching with React Query (Value 4 / Effort M)
  - Server pagination for documents and chat history (Value 4 / Effort M)
  - Dashboard activity & streaks groundwork (Value 4 / Effort M)
  - Rationale: Faster UI, scalable lists, and groundwork for meaningful analytics.

- Sprint 3 (Discovery & Study features)
  - Document metadata & search (Value 4 / Effort M)
  - Flashcards enhancements (Value 4 / Effort M)
  - Quizzes results view (Value 4 / Effort M)
  - Rationale: Improve findability and deepen study workflows.
