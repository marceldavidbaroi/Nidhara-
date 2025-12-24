# **System Planning Template (Generic / Repo-ready)**

## **1. Requirements Gathering**

**Purpose:** Define what the system should do and its constraints.

**Tasks:**

- Identify actors/users
- List core features
- Define non-functional requirements (performance, security, scalability)
- Optional: Identify external integrations (APIs, services)

**Deliverables:**

- Requirements Document (`requirements.md`)
- Feature list
- Use Case Diagram (optional)

**Example format:**

```
# Requirements
## Actors
- User
- Admin
## Features
- Feature 1: ...
- Feature 2: ...
## Non-functional Requirements
- Security: ...
- Performance: ...
```

---

## **2. Workflows & Use Cases**

**Purpose:** Capture how users interact with the system.

**Tasks:**

- For each feature, define the user workflow
- Identify decisions and states
- Draw diagrams:

  - Activity Diagram
  - Sequence Diagram
  - State Diagram (if needed)

**Deliverables:**

- Workflows document (`workflows.md`)
- Diagrams folder (`diagrams/`)

---

## **3. System Architecture**

**Purpose:** Define modules, components, and their interactions.

**Tasks:**

- Identify system modules (frontend, backend, database, services)
- Define module responsibilities
- Define communication patterns
- Draw diagrams:

  - Architecture Diagram
  - Component Diagram
  - Deployment Diagram (optional)

**Deliverables:**

- Architecture document (`architecture.md`)
- Diagrams folder (`diagrams/architecture/`)

---

## **4. Data & Storage Design**

**Purpose:** Plan data structure, storage, and access.

**Tasks:**

- Identify entities and relationships
- Plan database structure (tables / collections)
- Plan queries and indexing
- Draw diagrams:

  - ER Diagram
  - Data Flow Diagram (optional)

**Deliverables:**

- Data model document (`data_model.md`)
- Diagrams folder (`diagrams/data/`)

---

## **5. Behavioral & Interaction Design**

**Purpose:** Define how objects/components interact and behave.

**Tasks:**

- Identify where behavioral patterns are useful (Observer, Strategy, Command, State)
- Define object responsibilities
- Draw diagrams:

  - Sequence Diagram
  - Interaction Diagram

**Deliverables:**

- Behavioral design document (`behavior.md`)
- Diagrams folder (`diagrams/behavior/`)

---

## **6. UI / UX Planning**

**Purpose:** Define user interface and component interactions.

**Tasks:**

- Draw wireframes / mockups for each screen
- Define component states (loading, error, success)
- Define navigation flow

**Deliverables:**

- Wireframes folder (`ui/wireframes/`)
- Navigation diagram (`diagrams/ui/`)

---

## **7. Refinement & Documentation**

**Purpose:** Consolidate planning into a developer-ready blueprint.

**Tasks:**

- Finalize modules, features, and workflows
- Document design decisions
- Validate patterns and architecture
- Review diagrams for completeness

**Deliverables:**

- System Design Document (`design.md`)
- Complete diagrams folder (`diagrams/`)
- Developer checklist (`checklist.md`)

---

## **8. Coding Preparation**

**Purpose:** Prepare the repo and codebase according to the plan.

**Tasks:**

- Setup project structure based on architecture
- Implement state management / modules
- Follow component design patterns and workflows
- Use diagrams and design notes as reference

**Deliverables:**

- Initialized project repo
- Folder structure aligned with architecture
- Ready-to-code modules and components

---

### ✅ **Tips for Using This Template**

1. Follow **top-down**: Requirements → Architecture → Data → Behavior → UI → Code
2. Keep diagrams **simple and clear**
3. Document **every decision** for team members or future reference
4. Revisit planning if requirements change
5. Think **modules, responsibilities, interactions**, not just screens or files

---
