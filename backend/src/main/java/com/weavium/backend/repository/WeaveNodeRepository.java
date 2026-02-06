package com.weavium.backend.repository;

import com.weavium.backend.entity.WeaveNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WeaveNodeRepository extends Neo4jRepository<WeaveNode, UUID> {
    // By extending Neo4jRepository, we get standard CRUD operations automatically.
    // Later, we can add custom queries here like:
}
