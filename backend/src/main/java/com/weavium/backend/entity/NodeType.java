package com.weavium.backend.entity;

public enum NodeType {

    AXIOM, // A foundational truth or starting point
    HYPOTHESIS, // A proposed explanation
    DERIVATION, // Logically follows from other nodes
    METAPHOR, // Explains a concept via analogy - maybe drop!
    CITATION, // References to external work (arXiv etc.)
    OBJECTION // Counter-argument or critique

}
