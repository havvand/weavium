package com.weavium.backend.repository;

import com.weavium.backend.entity.UserNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface UserNodeRepository extends Neo4jRepository<UserNode, UUID> {

    // Spring Data Neo4j automatically writes the Cypher query for these!
    Optional<UserNode> findByUsername(String username);

    Optional<UserNode> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
