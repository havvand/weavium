package com.weavium.backend.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.Instant;
import java.util.*;


@Node("WeaveNode")  // Explicit naming of the node label in the Graph
@Data               // lombok generates getters, setters, toString etc.
@NoArgsConstructor  // Generates a no-args const (required by SpringBoot)

public class WeaveNode {

    @Id
    @GeneratedValue(generatorClass = GeneratedValue.UUIDGenerator.class)
    private UUID id;

    private String title;

    private String description;

    private NodeType type;

    private Set<String> tags = new HashSet<>();


    @Relationship(type = "LINKS_TO", direction = Relationship.Direction.OUTGOING)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<WeaveLink> links = new HashSet<>();

    // Fields for audit (track changes)
    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    // Const for convenience (Lombok handles the empty one)
    public WeaveNode (String title, NodeType type){
        this.title = title;
        this.type = type;
    }

}
