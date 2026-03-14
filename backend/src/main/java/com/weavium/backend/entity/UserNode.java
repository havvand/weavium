package com.weavium.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@Node("User")
public class UserNode {

    @Id
    @GeneratedValue(generatorClass = GeneratedValue.UUIDGenerator.class)
    private UUID id;

    private String username;

    private String email;

    private String passwordHash;

    @CreatedDate
    private Instant createdAt;


}
