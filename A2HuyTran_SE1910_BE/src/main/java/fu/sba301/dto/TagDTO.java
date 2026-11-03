package fu.sba301.dto;

import jakarta.validation.constraints.NotBlank;

public class TagDTO {
    private Integer tagID;

    @NotBlank(message = "Tag name is required")
    private String tagName;

    private String note;

    public TagDTO() {
    }

    public TagDTO(Integer tagID, String tagName, String note) {
        this.tagID = tagID;
        this.tagName = tagName;
        this.note = note;
    }

    public Integer getTagID() {
        return tagID;
    }

    public void setTagID(Integer tagID) {
        this.tagID = tagID;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
