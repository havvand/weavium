package com.weavium.backend.controller;

import com.weavium.backend.entity.NodeType;
import com.weavium.backend.entity.WeaveNode;
import com.weavium.backend.repository.WeaveNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@CrossOrigin("*")
@Controller
@RequiredArgsConstructor // Lombok generates cons for final fields
public class WeaveNodeController {

    private final WeaveNodeRepository repository;

    // Matches 'type Query { nodes: ...}' in schema
    @QueryMapping
    public List<WeaveNode> nodes() {
        return repository.findAll();
    }

    @QueryMapping
    public Optional<WeaveNode> nodeById(@Argument UUID id) {
        return repository.findById(id);
    }

    @MutationMapping
    public WeaveNode createNode(@Argument String title, @Argument NodeType type, @Argument String description) {
        WeaveNode node = new WeaveNode(title, type);
        node.setDescription(description);

        // Can add default tags here in the future

        return repository.save(node);
    }
}
