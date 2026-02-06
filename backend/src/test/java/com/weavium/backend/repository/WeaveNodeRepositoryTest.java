package com.weavium.backend.repository;

import com.weavium.backend.entity.NodeType;
import com.weavium.backend.entity.WeaveNode;
import com.weavium.backend.repository.WeaveNodeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.neo4j.test.autoconfigure.DataNeo4jTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import  org.testcontainers.neo4j.Neo4jContainer;

import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
@DataNeo4jTest // Only loads Neo4j related components
@Testcontainers // Enable test containers
public class WeaveNodeRepositoryTest {

    //Define the Neo4j Container to run during tests
    @Container
    static Neo4jContainer neo4jContainer = new Neo4jContainer("neo4j:5").withAdminPassword("password");

    // Connect Spring Boot to the random port Testcontainers picks
    @DynamicPropertySource
    static void neo4jProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.neo4j.uri", neo4jContainer::getBoltUrl);
        registry.add("spring.neo4j.authentication.username", () -> "neo4j");
        registry.add("spring.neo4j.authentication.password", neo4jContainer::getAdminPassword);
    }

    @Autowired
    private WeaveNodeRepository repository;

    @Test
    void shouldSaveAndRetrieveAWeaveNode() {
        // Given
        WeaveNode originalNode = new WeaveNode("The First Axiom", NodeType.AXIOM);
        originalNode.setDescription("Truth is self-evident");
        originalNode.getTags().add("Philosophy");

        // When
        WeaveNode savedNode = repository.save(originalNode);

        // Then
        assertThat(savedNode.getId()).isNotNull();

        // Fetch from DB to verify
        Optional<WeaveNode> fetchedNode = repository.findById(savedNode.getId());

        assertThat(fetchedNode).isPresent();
        assertThat(fetchedNode.get().getTitle()).isEqualTo("The First Axiom");
        assertThat(fetchedNode.get().getType()).isEqualTo(NodeType.AXIOM);
        assertThat(fetchedNode.get().getTags()).contains("Philosophy");
    }

}
