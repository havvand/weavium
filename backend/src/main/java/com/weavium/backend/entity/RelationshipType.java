package com.weavium.backend.entity;

public enum RelationshipType {
    SUPPORTS,       // Strengthens the target node
    CONTRADICTS,     // Weakens or disputes the target node
    DERIVED_FROM,   // The source comes from the target node
    RELATED_TO      // General semantic connection
}
