package com.ravionics.employeemanagementsystem.services;

import com.ravionics.employeemanagementsystem.entities.OfferTemplate;
import com.ravionics.employeemanagementsystem.repositories.OfferTemplateRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OfferTemplateService {

    private final OfferTemplateRepository templateRepository;

    public OfferTemplateService(OfferTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public List<Map<String, Object>> getAllTemplateNames() {
        return templateRepository.findAll()
                .stream()
                .map(template -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", template.getId());
                    map.put("name", template.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public OfferTemplate getTemplateById(Integer id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
    }

    public void updateTemplate(Integer id, OfferTemplate updatedTemplate) {
        OfferTemplate existingTemplate = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        existingTemplate.setHeader(updatedTemplate.getHeader());
        existingTemplate.setBody(updatedTemplate.getBody());
        existingTemplate.setFooter(updatedTemplate.getFooter());
        templateRepository.save(existingTemplate);
    }
}
