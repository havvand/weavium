package com.weavium.backend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.config.EnableNeo4jAuditing;

@Configuration
@EnableNeo4jAuditing // Automatically populate @CreatedDate and @LastModifiedDate
public class Neo4jConfig {
}