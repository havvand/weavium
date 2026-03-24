package com.weavium.backend.controller;

import com.weavium.backend.entity.*;
import com.weavium.backend.repository.UserNodeRepository;
import com.weavium.backend.repository.WeaveNodeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@CrossOrigin("*")
@Controller
@RequiredArgsConstructor // Lombok generates cons for final fields
public class WeaveNodeController {

    private final WeaveNodeRepository repository;
    private final UserNodeRepository userNodeRepository;

    // Matches 'type Query { nodes: ...}' in schema
    @QueryMapping
    public List<WeaveNode> nodes() {
        return repository.findAll();
    }

    @QueryMapping
    public Optional<WeaveNode> nodeById(@Argument UUID id) {
        return repository.findById(id);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public WeaveNode createNode(@Argument String title, @Argument NodeType type, @Argument String description, Principal principal) {
        String username = principal.getName();
        UserNode owner = userNodeRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found in database")); // orElseThrow because it is an optional.

        WeaveNode node = new WeaveNode(title, type);
        node.setDescription(description);

        node.setOwner(owner);

        // Can add default tags here in the future

        return repository.save(node);
    }
   @PreAuthorize("isAuthenticated()")
   @MutationMapping
   public WeaveNode updateNode(@Argument UUID id, @Argument String title, @Argument String description, @Argument NodeType type, Principal principal) {
        WeaveNode node = repository.findById(id).orElseThrow(()-> new RuntimeException("Node not found!"));

       if (node.getOwner() == null || !node.getOwner().getUsername().equals(principal.getName()))
       {
           throw new RuntimeException("Forbidden: You do not have permission to edit this node");
       }

        if (title != null) node.setTitle(title);
        if (description != null) node.setDescription(description);
        if (type != null) node.setType(type);
        return repository.save(node);
   }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
   public Boolean deleteNode(@Argument UUID id, Principal principal) {
        WeaveNode node = repository.findById(id).orElseThrow(() -> new RuntimeException("Node not found!"));

        if (node.getOwner() == null || !node.getOwner().getUsername().equals(principal.getName()))
        {
            throw new RuntimeException("Forbidden: You do not have permission to delete this node");
        }

        repository.deleteById(id);
        return true;
   }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public WeaveNode linkNodes(@Argument UUID sourceId, @Argument UUID targetId, @Argument RelationshipType type, Principal principal) {
        // Fetch both nodes
        WeaveNode source = repository.findById(sourceId).orElseThrow(()->new RuntimeException("Source node not found"));
        WeaveNode target = repository.findById(targetId).orElseThrow(()->new RuntimeException("Target node not found"));

        if (source.getOwner() == null || !source.getOwner().getUsername().equals(principal.getName()))
        {
            throw new RuntimeException("Forbidden: You do not have permission to link this node");
        }

        // Create Link
        WeaveLink link  = new WeaveLink(target, type);

        // Add link to source
        source.getLinks().add(link);

        return repository.save(source);
    }
}
