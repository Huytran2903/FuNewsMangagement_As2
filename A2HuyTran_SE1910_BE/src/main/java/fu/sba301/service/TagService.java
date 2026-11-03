package fu.sba301.service;

import fu.sba301.dto.TagDTO;
import fu.sba301.entity.Tag;
import fu.sba301.exception.ResourceNotFoundException;
import fu.sba301.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<Tag> getAllTags(String query) {
        if (StringUtils.hasText(query)) {
            return tagRepository.searchTags(query.trim());
        }
        return tagRepository.findAll();
    }

    public Tag getTagById(Integer id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));
    }

    @Transactional
    public Tag createTag(TagDTO dto) {
        Tag tag = new Tag();
        tag.setTagName(dto.getTagName());
        tag.setNote(dto.getNote());
        return tagRepository.save(tag);
    }

    @Transactional
    public Tag updateTag(Integer id, TagDTO dto) {
        Tag tag = getTagById(id);
        tag.setTagName(dto.getTagName());
        tag.setNote(dto.getNote());
        return tagRepository.save(tag);
    }

    @Transactional
    public void deleteTag(Integer id) {
        Tag tag = getTagById(id);
        tagRepository.delete(tag);
    }
}
