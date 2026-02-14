package com.weavium.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
@Data
@NoArgsConstructor
public class WeaveLink {

    @Id @GeneratedValue
    private Long Id;

    private RelationshipType type;

    private Double weight = 1.0; // Strength of link (for AI later)

    @TargetNode
    private WeaveNode target;

    public WeaveLink (WeaveNode target, RelationshipType type) {
        this.target = target;
        this.type = type;
        this.weight = 1.0;

    }
}
