package com.weavium.backend.entity;

public enum RelationshipType {
    PROPOSES,       // Theory -> Hypothesis (Main claims)
    EXPLORES,       // Theory -> Evidence/Concepts (The scaffolding)
    SUPPORTS,       // Strengthens the target node / Builds the argument
    CONTRADICTS,     // Weakens or disputes the target node / Attacks the argument
    DERIVED_FROM,   // The source comes from the target node / Logical flow
    RELATED_TO      // General semantic connection / Peer-to-peer semantic link
}
