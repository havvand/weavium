<p align="center">
<img margin="auto" height="300px" src="C:\Users\havva\personal_project\weavium\docs\WeaviumLogo.png" width="300px"/>
</p>

Weavium: A Living Document for Evolving Thoughts
Weavium is a modular, semantic platform for building, visualizing, and evolving complex, layered intellectual frameworks. It treats ideas not as static, linear documents, but as dynamic, interconnected graphs of thought.
1. Core Purpose
   The goal of Weavium is to provide a platform for thinkers, researchers, and creators to map out complex ideas—such as scientific theories, philosophical systems, or interdisciplinary models—in a way that reflects their true, non-linear nature. It moves beyond the limitations of traditional documents (papers, books) and static knowledge bases by representing theories as a dynamic "weave" of modular concepts, assertions, and dependencies.
2. Core Concepts
   The entire system is built on a few key primitives:
   Element
   Description
   WeaveNode
   The atomic unit of the system: a single, structured idea, claim, concept, or principle.
   Weave
   A complete theory or intellectual framework composed of interconnected WeaveNodes.
   AnchorPoint
   A foundational or axiomatic WeaveNode that is not derived from other nodes within its Weave.
   Thread
   A curated, thematic path through a Weave, allowing for multiple perspectives or "entry points."
   CrossWeave Link
   A reference connecting a WeaveNode in one Weave to a WeaveNode in a different Weave.
   Critique Layer
   An attached commentary, counter-argument, or alternative perspective on any given WeaveNode.

3. MVP Technology Stack
   This project will be built using a modern, robust, and scalable tech stack suitable for a graph-intensive application.
   Layer
   Technology
   Purpose
   Backend
   Java (Spring Boot)
   Core application logic, versioning
   Database
   Neo4j (Graph Database)
   Storing nodes and relationships
   API Layer
   GraphQL
   Flexible, powerful data querying
   Frontend
   React (Vite)
   User interface and interaction
   Graph Viz
   D3.js / Cytoscape.js
   Rendering interactive graph views
   Auth
   Keycloak / OAuth 2.0
   User authentication and authorization
   Editor UX
   Markdown Block Editor (e.g., Milkdown, TipTap)
   Rich text editing for node content



